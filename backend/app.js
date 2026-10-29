import crypto from 'node:crypto';
import express from 'express';
import http from 'node:http';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { Server } from 'socket.io';
import { checkDatabaseConnection, prisma } from './db.js';
import { PrismaSessionStore } from './session-store.js';
import { errorHandler, ApiError } from './errors.js';
import { registerAuthRoutes } from './auth.js';
import { coreRouter } from './core-routes.js';
import { roadmapRouter } from './roadmaps.js';
import { assertConversationParticipant, saveMessage, chatRouter } from './chat.js';
import { aiChatRouter } from './ai-chat.js';

function socketFailure(error, socket) {
  if (error instanceof ApiError) return { ok: false, error: error.code, message: error.message };
  console.error(JSON.stringify({
    level: 'error',
    message: 'Socket request failed',
    socketId: socket.id,
    error: error?.message || String(error)
  }));
  return { ok: false, error: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' };
}

function originsFromEnvironment() {
  const configured = [
    process.env.FRONTEND_ORIGIN,
    ...(process.env.CORS_ORIGINS || '').split(',')
  ].map((origin) => origin?.trim()).filter(Boolean);
  return configured.length ? [...new Set(configured)] : ['http://localhost:5173', 'http://127.0.0.1:5173'];
}

export function createApp() {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    throw new Error('SESSION_SECRET must be configured with at least 32 characters.');
  }
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI must be configured.');

  const app = express();
  const origins = originsFromEnvironment();
  const cookieName = process.env.SESSION_COOKIE_NAME || 'ii.sid';
  const sessionMiddleware = session({
    name: cookieName,
    secret: process.env.SESSION_SECRET,
    store: new PrismaSessionStore(),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: process.env.SESSION_COOKIE_SECURE === 'true' || (process.env.SESSION_COOKIE_SECURE !== 'false' && process.env.NODE_ENV === 'production'),
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/'
    }
  });

  app.disable('x-powered-by');
  app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? 1 : false);
  app.use((req, res, next) => {
    req.id = req.get('x-request-id')?.slice(0, 100) || crypto.randomUUID();
    res.setHeader('X-Request-Id', req.id);
    req.log = {
      error: (details, message) => console.error(JSON.stringify({ level: 'error', time: new Date().toISOString(), ...details, message }))
    };
    next();
  });
  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (!origin || origins.includes(origin)) return callback(null, true);
      return callback(new ApiError(403, 'ORIGIN_NOT_ALLOWED', 'This origin is not allowed.'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Request-Id']
  }));
  app.use('/api', rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: { code: 'RATE_LIMITED', message: 'Too many requests. Try again later.' } }
  }));
  app.use(express.json({ limit: '100kb' }));
  app.use(sessionMiddleware);

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false,
    message: { error: { code: 'RATE_LIMITED', message: 'Too many sign-in attempts. Try again later.' } }
  });
  const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false,
    message: { error: { code: 'RATE_LIMITED', message: 'Too many account creation attempts. Try again later.' } }
  });
  const api = express.Router();
  api.get('/health', (req, res) => res.json({ data: { status: 'ok' } }));
  api.get('/ready', async (req, res) => {
    try {
      await checkDatabaseConnection();
      res.json({ data: { status: 'ready', database: 'connected' } });
    } catch (error) {
      req.log.error({ code: error?.code, requestId: req.id }, 'Database readiness check failed');
      res.status(503).json({
        error: { code: 'DATABASE_UNAVAILABLE', message: 'Database is unavailable.', requestId: req.id }
      });
    }
  });
  registerAuthRoutes(api, loginLimiter, registerLimiter);
  api.use(coreRouter());
  api.use(roadmapRouter());
  app.use('/api', api);

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: origins, credentials: true },
    serveClient: false,
    maxHttpBufferSize: 64 * 1024
  });
  io.engine.use(sessionMiddleware);
  io.use(async (socket, next) => {
    try {
      const userId = socket.request.session?.userId;
      if (!userId) return next(new Error('Unauthorized'));
      const user = await prisma.user.findFirst({ where: { id: userId, status: 'ACTIVE' }, select: { id: true } });
      if (!user) return next(new Error('Unauthorized'));
      socket.data.userId = user.id;
      return next();
    } catch (error) {
      return next(error);
    }
  });
  io.on('connection', (socket) => {
    socket.on('conversation:join', async (input, acknowledge = () => {}) => {
      try {
        const conversationId = typeof input?.conversationId === 'string' ? input.conversationId : '';
        if (!conversationId) throw new ApiError(400, 'VALIDATION_ERROR', 'Conversation ID is required.');
        await assertConversationParticipant(conversationId, socket.data.userId);
        socket.join(`conversation:${conversationId}`);
        acknowledge({ ok: true });
      } catch (error) {
        acknowledge(socketFailure(error, socket));
      }
    });
    socket.on('message:send', async (input, acknowledge = () => {}) => {
      try {
        const now = Date.now();
        const window = socket.data.messageWindow;
        if (!window || window.resetAt <= now) {
          socket.data.messageWindow = { count: 0, resetAt: now + 10_000 };
        } else if (window.count >= 20) {
          throw new ApiError(429, 'RATE_LIMITED', 'Too many messages. Wait before sending more.');
        }
        socket.data.messageWindow.count += 1;
        const content = typeof input?.content === 'string' ? input.content.trim() : '';
        const clientId = typeof input?.clientId === 'string' ? input.clientId : undefined;
        const conversationId = typeof input?.conversationId === 'string' ? input.conversationId : '';
        if (!content || content.length > 4000 || !conversationId || (clientId && clientId.length > 100)) {
          throw new ApiError(400, 'VALIDATION_ERROR', 'Conversation ID and a message up to 4000 characters are required.');
        }
        await assertConversationParticipant(conversationId, socket.data.userId);
        const message = await saveMessage({ conversationId, senderId: socket.data.userId, content, clientId });
        io.to(`conversation:${conversationId}`).emit('message:new', message);
        acknowledge({ ok: true, message });
      } catch (error) {
        acknowledge(socketFailure(error, socket));
      }
    });
  });
  app.use('/api', chatRouter(io));
  app.use('/api', aiChatRouter());
  app.use('/api', (req, res, next) => next(new ApiError(404, 'NOT_FOUND', 'API endpoint not found.')));
  app.use(errorHandler);

  return { app, io, server };
}
