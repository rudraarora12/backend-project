import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from './db.js';
import { ApiError, asyncRoute, parseInput } from './errors.js';

const emailSchema = z.string().trim().email().max(254).transform((value) => value.toLowerCase());
const registrationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: emailSchema,
  password: z.string().min(10).max(128),
  role: z.enum(['STUDENT', 'EXPERT']).default('STUDENT'),
  companyName: z.string().trim().max(100).optional(),
  roleTitle: z.string().trim().max(100).optional(),
  college: z.string().trim().max(150).optional(),
  degree: z.string().trim().max(150).optional(),
  branch: z.string().trim().max(150).optional(),
  graduationYear: z.number().int().min(1950).max(new Date().getFullYear() + 10).optional()
});
const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
  role: z.enum(['STUDENT', 'EXPERT']).optional(),
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
const firebaseLoginSchema = z.object({
  email: emailSchema,
  name: z.string().trim().min(1).max(100),
  avatar: z.string().url().max(500).optional().nullable()
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
    const userRole = input.role || 'STUDENT';
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: userRole,
        college: input.college || null,
        degree: input.degree || null,
        branch: input.branch || null,
        graduationYear: input.graduationYear || null
      }
    });

    // If registered as Partner / Expert, create initial verified mentor profile
    if (userRole === 'EXPERT') {
      try {
        const companyName = input.companyName || 'Amazon';
        const companySlug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        await prisma.mentorProfile.create({
          data: {
            ownerKey: `user:${user.id}`,
            userId: user.id,
            companyName,
            companySlug,
            roleTitle: input.roleTitle || 'Senior Software Engineer & Interview Partner',
            biography: `Verified industry partner and placement mentor at ${companyName}. Experienced in campus placement rounds, technical mock interviews, and behavioral STAR debriefs.`,
            topics: ['DSA & Algorithms', 'System Architecture', 'Bar Raiser Mock', 'STAR Behavioral'],
            price: 999,
            currency: 'INR',
            status: 'VERIFIED',
            isDemo: false
          }
        });
      } catch (e) {
        console.warn('Could not auto-generate mentor profile for partner:', e.message);
      }
    }

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

    // Role verification if specific role tab was selected
    if (input.role && user.role !== input.role && user.role !== 'ADMIN') {
      if (input.role === 'EXPERT' && user.role === 'STUDENT') {
        throw new ApiError(403, 'ROLE_MISMATCH', 'This account is registered as a Student. Please switch to the "Student" login tab, or register a new Partner account.');
      }
      if (input.role === 'STUDENT' && user.role === 'EXPERT') {
        throw new ApiError(403, 'ROLE_MISMATCH', 'This account is registered as an Industry Partner. Please switch to the "Partner" login tab.');
      }
    }

    await new Promise((resolve, reject) => {
      req.session.regenerate((error) => error ? reject(error) : resolve());
    });
    req.session.userId = user.id;
    req.session.cookie.maxAge = input.rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    res.json({ data: { user: publicUser(user) } });
  }));

  // Demo Fast Partner Login
  router.post('/auth/demo-partner', asyncRoute(async (req, res) => {
    const demoPartnerEmail = 'partner.arjun@intelligrid.dev';
    let user = await prisma.user.findUnique({ where: { email: demoPartnerEmail } });

    if (!user) {
      const dummyPassword = crypto.randomUUID() + crypto.randomUUID();
      const passwordHash = await bcrypt.hash(dummyPassword, 10);
      user = await prisma.user.create({
        data: {
          name: 'Arjun Mehta',
          email: demoPartnerEmail,
          passwordHash,
          role: 'EXPERT',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          college: 'IIT Delhi Alum',
          degree: 'B.Tech Computer Science'
        }
      });

      try {
        await prisma.mentorProfile.create({
          data: {
            ownerKey: `user:${user.id}`,
            userId: user.id,
            companyName: 'Amazon',
            companySlug: 'amazon',
            roleTitle: 'Senior SDE & Bar Raiser Partner',
            biography: 'Amazon Bar Raiser and Senior SDE with 6+ years evaluating placement loops, distributed systems, and leadership principles.',
            topics: ['Amazon SDE Rounds', 'Distributed Systems', 'LP & Behavioral', 'Live Coding Practice'],
            price: 999,
            currency: 'INR',
            status: 'VERIFIED',
            isDemo: false
          }
        });
      } catch (err) {
        console.warn('Demo partner profile creation note:', err.message);
      }
    } else if (user.role !== 'EXPERT') {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'EXPERT' }
      });
    }

    await new Promise((resolve, reject) => {
      req.session.regenerate((error) => (error ? reject(error) : resolve()));
    });
    req.session.userId = user.id;
    req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
    res.json({ data: { user: publicUser(user) } });
  }));

  router.post('/auth/firebase-login', asyncRoute(async (req, res) => {
    const input = parseInput(firebaseLoginSchema, req.body);
    let user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      const dummyPassword = crypto.randomUUID() + crypto.randomUUID();
      const passwordHash = await bcrypt.hash(dummyPassword, 10);
      user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash,
          avatar: input.avatar || null
        }
      });
    } else if (!user.avatar && input.avatar) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { avatar: input.avatar }
      });
    }
    await new Promise((resolve, reject) => {
      req.session.regenerate((error) => (error ? reject(error) : resolve()));
    });
    req.session.userId = user.id;
    req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
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
