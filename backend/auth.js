import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from './db.js';
import { ApiError, asyncRoute, parseInput } from './errors.js';

const emailSchema = z.string().trim().email().max(254).transform((value) => value.toLowerCase());
const registrationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: emailSchema,
  password: z.string().min(10).max(128),
  college: z.string().trim().max(150).optional(),
  degree: z.string().trim().max(150).optional(),
  branch: z.string().trim().max(150).optional(),
  graduationYear: z.number().int().min(1950).max(new Date().getFullYear() + 10).optional()
});
const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
  rememberMe: z.boolean().default(false)
});
const profileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  college: z.string().trim().max(150).nullable().optional(),
  degree: z.string().trim().max(150).nullable().optional(),
  branch: z.string().trim().max(150).nullable().optional(),
  graduationYear: z.number().int().min(1950).max(new Date().getFullYear() + 10).nullable().optional(),
  avatar: z.string().url().max(500).nullable().optional()
}).refine((value) => Object.keys(value).length > 0, 'Provide at least one profile field.');
const passwordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(10).max(128)
});

export function publicUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function requireAuth(req, res, next) {
  try {
    if (!req.session?.userId) throw new ApiError(401, 'AUTH_REQUIRED', 'Sign in to continue.');
    const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
    if (!user || user.status !== 'ACTIVE') {
      req.session.destroy(() => {});
      throw new ApiError(401, 'AUTH_REQUIRED', 'Sign in to continue.');
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'FORBIDDEN', 'You do not have permission to perform this action.'));
    }
    return next();
  };
}

export function registerAuthRoutes(router, loginLimiter, registerLimiter) {
  router.post('/auth/register', registerLimiter, asyncRoute(async (req, res) => {
    const input = parseInput(registrationSchema, req.body);
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        college: input.college,
        degree: input.degree,
        branch: input.branch,
        graduationYear: input.graduationYear
      }
    });
    await new Promise((resolve, reject) => {
      req.session.regenerate((error) => error ? reject(error) : resolve());
    });
    req.session.userId = user.id;
    res.status(201).json({ data: { user: publicUser(user) } });
  }));

  router.post('/auth/login', loginLimiter, asyncRoute(async (req, res) => {
    const input = parseInput(loginSchema, req.body);
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    const passwordValid = user ? await bcrypt.compare(input.password, user.passwordHash) : false;
    if (!user || !passwordValid || user.status !== 'ACTIVE') {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
    }
    await new Promise((resolve, reject) => {
      req.session.regenerate((error) => error ? reject(error) : resolve());
    });
    req.session.userId = user.id;
    req.session.cookie.maxAge = input.rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    res.json({ data: { user: publicUser(user) } });
  }));

  router.post('/auth/logout', requireAuth, asyncRoute(async (req, res) => {
    await new Promise((resolve, reject) => {
      req.session.destroy((error) => error ? reject(error) : resolve());
    });
    res.clearCookie(process.env.SESSION_COOKIE_NAME || 'ii.sid', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.SESSION_COOKIE_SECURE === 'true' || (process.env.SESSION_COOKIE_SECURE !== 'false' && process.env.NODE_ENV === 'production'),
      path: '/'
    });
    res.json({ data: { loggedOut: true } });
  }));

  router.get('/auth/me', asyncRoute(async (req, res) => {
    if (!req.session?.userId) {
      return res.json({ data: { user: null } });
    }
    const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
    if (!user || user.status !== 'ACTIVE') {
      req.session.destroy(() => {});
      return res.json({ data: { user: null } });
    }
    res.json({ data: { user: publicUser(user) } });
  }));

  router.patch('/users/me', requireAuth, asyncRoute(async (req, res) => {
    const input = parseInput(profileSchema, req.body);
    const user = await prisma.user.update({ where: { id: req.user.id }, data: input });
    res.json({ data: { user: publicUser(user) } });
  }));

  router.patch('/users/me/password', requireAuth, asyncRoute(async (req, res) => {
    const input = parseInput(passwordSchema, req.body);
    if (!(await bcrypt.compare(input.currentPassword, req.user.passwordHash))) {
      throw new ApiError(400, 'INVALID_PASSWORD', 'Current password is incorrect.');
    }
    const passwordHash = await bcrypt.hash(input.newPassword, 12);
    await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash } });
    res.json({ data: { changed: true } });
  }));
}
