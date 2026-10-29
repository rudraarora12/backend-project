import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { prisma } from './db.js';
import { ApiError, asyncRoute, parseInput } from './errors.js';
import { requireAuth } from './auth.js';

const createConversationSchema = z.object({ expertId: z.string().min(1) });
const messageSchema = z.object({
  content: z.string().trim().min(1).max(4000),
  clientId: z.string().trim().min(1).max(100).optional()
});

export async function assertConversationParticipant(conversationId, userId, client = prisma) {
  const conversation = await client.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ studentId: userId }, { expertUserId: userId }]
    },
    select: { id: true }
  });
  if (!conversation) throw new ApiError(403, 'FORBIDDEN', 'You are not a participant in this conversation.');
  return conversation;
}

export async function saveMessage({ conversationId, senderId, content, clientId }) {
  const stableClientId = clientId || randomUUID();
  return prisma.$transaction(async (tx) => {
    await assertConversationParticipant(conversationId, senderId, tx);
    const previous = await tx.message.findUnique({
      where: { conversationId_senderId_clientId: { conversationId, senderId, clientId: stableClientId } },
      include: { sender: { select: { id: true, name: true, avatar: true } } }
    });
    if (previous) return previous;
    const message = await tx.message.create({
      data: { conversationId, senderId, content, clientId: stableClientId },
      include: { sender: { select: { id: true, name: true, avatar: true } } }
    });
    await tx.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
    return message;
  });
}

export function chatRouter(io) {
  const router = Router();

  router.get('/conversations', requireAuth, asyncRoute(async (req, res) => {
    const conversations = await prisma.conversation.findMany({
      where: { OR: [{ studentId: req.user.id }, { expertUserId: req.user.id }] },
      orderBy: { updatedAt: 'desc' },
      include: {
        student: { select: { id: true, name: true, avatar: true } },
        expert: { select: { id: true, name: true, avatar: true } },
        mentor: { select: { id: true, companyName: true, roleTitle: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });
    res.json({ data: { conversations } });
  }));

  router.post('/conversations', requireAuth, asyncRoute(async (req, res) => {
    const { expertId } = parseInput(createConversationSchema, req.body);
    const mentor = await prisma.mentorProfile.findFirst({
      where: {
        id: expertId, status: 'VERIFIED', isDemo: false, userId: { not: null },
        user: { status: 'ACTIVE', role: 'EXPERT' }
      }
    });
    if (!mentor || mentor.userId === req.user.id) throw new ApiError(404, 'NOT_FOUND', 'Expert not found.');
    const conversation = await prisma.conversation.upsert({
      where: { studentId_mentorId: { studentId: req.user.id, mentorId: mentor.id } },
      create: { studentId: req.user.id, mentorId: mentor.id, expertUserId: mentor.userId },
      update: { expertUserId: mentor.userId },
      include: { student: { select: { id: true, name: true } }, expert: { select: { id: true, name: true } }, mentor: true }
    });
    res.status(201).json({ data: { conversation } });
  }));

  router.get('/conversations/:id/messages', requireAuth, asyncRoute(async (req, res) => {
    await assertConversationParticipant(req.params.id, req.user.id);
    const before = req.query.before ? new Date(String(req.query.before)) : undefined;
    if (before && Number.isNaN(before.getTime())) throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid message cursor.');
    const messages = await prisma.message.findMany({
      where: { conversationId: req.params.id, ...(before ? { createdAt: { lt: before } } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { sender: { select: { id: true, name: true, avatar: true } } }
    });
    res.json({ data: { messages: messages.reverse() } });
  }));

  router.post('/conversations/:id/messages', requireAuth, asyncRoute(async (req, res) => {
    const input = parseInput(messageSchema, req.body);
    const message = await saveMessage({
      conversationId: req.params.id, senderId: req.user.id, content: input.content, clientId: input.clientId
    });
    io.to(`conversation:${req.params.id}`).emit('message:new', message);
    res.status(201).json({ data: { message } });
  }));

  return router;
}
