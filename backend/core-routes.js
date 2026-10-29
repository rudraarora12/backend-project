import { Router } from 'express';
import { z } from 'zod';
import { prisma } from './db.js';
import { ApiError, asyncRoute, parseInput } from './errors.js';
import { requireAuth, requireRole } from './auth.js';

const pagingSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().max(100).optional()
});
const experienceSchema = z.object({
  companySlug: z.string().trim().min(1).max(100).optional(),
  company: z.string().trim().min(1).max(100),
  role: z.string().trim().min(1).max(120),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  channel: z.string().trim().max(100).optional(),
  location: z.string().trim().max(150).optional(),
  result: z.string().trim().max(50).optional(),
  difficulty: z.number().min(1).max(5).optional(),
  compensation: z.string().trim().max(100).optional(),
  prepAdvice: z.string().trim().min(10).max(5000),
  candidateExperience: z.string().trim().max(5000).optional(),
  anonymous: z.boolean().default(false),
  rounds: z.array(z.object({
    type: z.string().trim().min(1).max(100),
    duration: z.string().trim().max(50).optional(),
    difficulty: z.string().trim().max(30).optional(),
    topics: z.preprocess((value) => typeof value === 'string'
      ? value.split(/[,;\n]+/).map((part) => part.trim()).filter(Boolean)
      : value, z.array(z.string().trim().min(1).max(100)).max(30).default([])),
    questions: z.preprocess((value) => typeof value === 'string'
      ? value.split(/[,;\n]+/).map((part) => part.trim()).filter(Boolean)
      : value, z.array(z.string().trim().min(1).max(300)).max(50).default([]))
  })).min(1).max(12)
});
const bookmarkSchema = z.object({
  type: z.enum(['COMPANY', 'EXPERIENCE', 'QUESTION']),
  id: z.string().min(1).max(100)
});
const slotSchema = z.object({
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  timeZone: z.string().trim().min(1).max(80),
  price: z.number().int().min(0).max(100000).optional()
})
  .refine((value) => new Date(value.endsAt) > new Date(value.startsAt), 'Slot end must be after its start.')
  .refine((value) => new Date(value.startsAt) > new Date(), 'Availability must start in the future.')
  .refine((value) => {
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: value.timeZone });
      return true;
    } catch {
      return false;
    }
  }, 'Time zone must be a valid IANA time zone.');
const bookingSchema = z.object({
  slotId: z.string().min(1),
  notes: z.string().trim().max(2000).optional()
});
const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional()
});
const expertApplicationSchema = z.object({
  companyName: z.string().trim().min(1).max(100),
  companySlug: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/),
  roleTitle: z.string().trim().min(1).max(120),
  biography: z.string().trim().min(30).max(3000),
  topics: z.array(z.string().trim().min(1).max(80)).min(1).max(20),
  price: z.number().int().min(0).max(100000).optional()
});
const moderationSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'FLAGGED'])
});
const adminExperienceQuerySchema = pagingSchema.extend({
  status: z.enum(['PENDING', 'APPROVED', 'FLAGGED']).default('PENDING')
});
const questionInclude = { question: true };

function pageData(page, limit, total) {
  return { page, limit, total, pages: Math.ceil(total / limit) };
}

export function coreRouter() {
  const router = Router();

  router.get('/experiences', asyncRoute(async (req, res) => {
    const { page, limit, q } = parseInput(pagingSchema, req.query);
    const where = {
      status: 'APPROVED',
      ...(q ? { OR: [
        { companyName: { contains: q, mode: 'insensitive' } },
        { role: { contains: q, mode: 'insensitive' } },
        { rounds: { some: { topics: { has: q } } } }
      ] } : {})
    };
    const [experiences, total] = await prisma.$transaction([
      prisma.interviewExperience.findMany({
        where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit,
        include: {
          rounds: { orderBy: { position: 'asc' } },
          author: { select: { name: true } },
          company: { select: { slug: true } },
          questions: { include: questionInclude }
        }
      }),
      prisma.interviewExperience.count({ where })
    ]);
    res.json({ data: { experiences: experiences.map((experience) => ({
      ...experience,
      company: experience.companyName,
      companySlug: experience.company?.slug,
      ctc: experience.compensation,
      authorName: experience.anonymous ? 'Anonymous Candidate' : experience.author?.name || 'Student Peer',
      questions: experience.questions.map(({ question }) => question.title),
      topics: [...new Set(experience.rounds.flatMap((round) => round.topics))]
    })), pagination: pageData(page, limit, total) } });
  }));

  router.get('/experiences/:id', asyncRoute(async (req, res) => {
    const experience = await prisma.interviewExperience.findFirst({
      where: { id: req.params.id, status: 'APPROVED' },
      include: { rounds: { orderBy: { position: 'asc' } }, author: { select: { name: true } }, company: { select: { slug: true } }, questions: { include: questionInclude } }
    });
    if (!experience) throw new ApiError(404, 'NOT_FOUND', 'Experience not found.');
    res.json({ data: { experience: {
      ...experience,
      company: experience.companyName,
      companySlug: experience.company?.slug,
      ctc: experience.compensation,
      authorName: experience.anonymous ? 'Anonymous Candidate' : experience.author?.name || 'Student Peer',
      questions: experience.questions.map(({ question }) => question.title),
      topics: [...new Set(experience.rounds.flatMap((round) => round.topics))]
    } } });
  }));

  router.get('/companies', asyncRoute(async (req, res) => {
    const { page, limit, q } = parseInput(pagingSchema, req.query);
    const where = q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { category: { contains: q, mode: 'insensitive' } }] } : {};
    const [companies, total] = await prisma.$transaction([
      prisma.company.findMany({
        where, orderBy: { name: 'asc' }, skip: (page - 1) * limit, take: limit,
        include: { _count: { select: { experiences: { where: { status: 'APPROVED' } }, questions: true } } }
      }),
      prisma.company.count({ where })
    ]);
    res.json({ data: { companies: companies.map(({ _count, ...company }) => ({
      ...company, experienceCount: _count.experiences, questionsCount: _count.questions
    })), pagination: pageData(page, limit, total) } });
  }));

  router.get('/companies/:slug', asyncRoute(async (req, res) => {
    const company = await prisma.company.findUnique({
      where: { slug: req.params.slug },
      include: {
        questions: { include: questionInclude, orderBy: { question: { reports: 'desc' } }, take: 30 },
        _count: { select: { experiences: { where: { status: 'APPROVED' } }, questions: true } }
      }
    });
    if (!company) throw new ApiError(404, 'NOT_FOUND', 'Company not found.');
    const { _count, questions, ...record } = company;
    res.json({ data: { company: {
      ...record, experienceCount: _count.experiences, questionsCount: _count.questions,
      freqQuestions: questions.map(({ question }) => question)
    } } });
  }));

  router.get('/companies/:slug/experiences', asyncRoute(async (req, res) => {
    const { page, limit } = parseInput(pagingSchema, req.query);
    const company = await prisma.company.findUnique({ where: { slug: req.params.slug }, select: { id: true } });
    if (!company) throw new ApiError(404, 'NOT_FOUND', 'Company not found.');
    const where = { companyId: company.id, status: 'APPROVED' };
    const [experiences, total] = await prisma.$transaction([
      prisma.interviewExperience.findMany({
        where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit,
        include: { rounds: { orderBy: { position: 'asc' } }, author: { select: { name: true } }, questions: { include: questionInclude } }
      }),
      prisma.interviewExperience.count({ where })
    ]);
    res.json({ data: { experiences: experiences.map((experience) => ({
      ...experience,
      authorName: experience.anonymous ? 'Anonymous Candidate' : experience.author?.name || 'Student Peer',
      questions: experience.questions.map(({ question }) => question.title),
      topics: [...new Set(experience.rounds.flatMap((round) => round.topics))]
    })), pagination: pageData(page, limit, total) } });
  }));

  router.get('/questions', asyncRoute(async (req, res) => {
    const { page, limit, q } = parseInput(pagingSchema, req.query);
    const where = q ? { title: { contains: q, mode: 'insensitive' } } : {};
    const [questions, total] = await prisma.$transaction([
      prisma.question.findMany({ where, orderBy: [{ reports: 'desc' }, { title: 'asc' }], skip: (page - 1) * limit, take: limit }),
      prisma.question.count({ where })
    ]);
    res.json({ data: { questions, pagination: pageData(page, limit, total) } });
  }));

  router.post('/experiences', requireAuth, asyncRoute(async (req, res) => {
    const input = parseInput(experienceSchema, req.body);
    const companySlug = input.companySlug || input.company.toLowerCase().replace(/[\s&/]+/g, '-');
    const company = await prisma.company.findUnique({ where: { slug: companySlug } });
    if (!company) throw new ApiError(400, 'INVALID_COMPANY', 'Choose a company from the company directory.');
    const questionTitles = [...new Set(input.rounds.flatMap((round) => round.questions))];
    const questions = await Promise.all(questionTitles.map((title) => prisma.question.upsert({
      where: { title },
      create: { title, topic: 'Interview experience', difficulty: 'Unknown', isDemo: false },
      update: {}
    })));
    const experience = await prisma.interviewExperience.create({
      data: {
        authorId: req.user.id, companyId: company.id, companyName: company.name,
        role: input.role, year: input.year, channel: input.channel, location: input.location,
        result: input.result, difficulty: input.difficulty, compensation: input.compensation,
        prepAdvice: input.prepAdvice,
        candidateExperience: input.candidateExperience, anonymous: input.anonymous,
        status: 'PENDING', verified: false,
        rounds: { create: input.rounds.map((round, index) => ({ ...round, position: index + 1 })) },
        questions: { create: questions.map(({ id }) => ({ questionId: id })) }
      },
      include: { rounds: { orderBy: { position: 'asc' } }, questions: { include: questionInclude } }
    });
    res.status(201).json({ data: { experience } });
  }));

  router.post('/experiences/:id/vote', requireAuth, asyncRoute(async (req, res) => {
    const experience = await prisma.interviewExperience.findFirst({ where: { id: req.params.id, status: 'APPROVED' } });
    if (!experience) throw new ApiError(404, 'NOT_FOUND', 'Experience not found.');
    const vote = await prisma.experienceVote.findUnique({
      where: { userId_experienceId: { userId: req.user.id, experienceId: experience.id } }
    });
    if (vote) {
      await prisma.$transaction([
        prisma.experienceVote.delete({ where: { userId_experienceId: { userId: req.user.id, experienceId: experience.id } } }),
        prisma.interviewExperience.update({ where: { id: experience.id }, data: { helpfulVotes: { decrement: 1 } } })
      ]);
    } else {
      await prisma.$transaction([
        prisma.experienceVote.create({ data: { userId: req.user.id, experienceId: experience.id } }),
        prisma.interviewExperience.update({ where: { id: experience.id }, data: { helpfulVotes: { increment: 1 } } })
      ]);
    }
    res.json({ data: { voted: !vote, votes: Math.max(0, experience.helpfulVotes + (vote ? -1 : 1)) } });
  }));

  router.get('/experiences/:id/vote', requireAuth, asyncRoute(async (req, res) => {
    const vote = await prisma.experienceVote.findUnique({
      where: { userId_experienceId: { userId: req.user.id, experienceId: req.params.id } },
      select: { userId: true }
    });
    res.json({ data: { voted: Boolean(vote) } });
  }));

  router.get('/bookmarks', requireAuth, asyncRoute(async (req, res) => {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { company: true, experience: true, question: true }
    });
    res.json({ data: { bookmarks } });
  }));

  router.put('/bookmarks', requireAuth, asyncRoute(async (req, res) => {
    const { type, id } = parseInput(bookmarkSchema, req.body);
    const targetKey = { COMPANY: 'companyId', EXPERIENCE: 'experienceId', QUESTION: 'questionId' }[type];
    const model = { COMPANY: prisma.company, EXPERIENCE: prisma.interviewExperience, QUESTION: prisma.question }[type];
    const target = await model.findUnique({
      where: { id },
      select: type === 'EXPERIENCE' ? { id: true, status: true } : { id: true }
    });
    if (!target || type === 'EXPERIENCE' && target.status !== 'APPROVED') {
      throw new ApiError(404, 'NOT_FOUND', 'Bookmark target not found.');
    }
    const identityKey = `${req.user.id}:${type}:${id}`;
    const where = { identityKey };
    const existing = await prisma.bookmark.findFirst({ where });
    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return res.json({ data: { bookmarked: false } });
    }
    await prisma.bookmark.create({
      data: { userId: req.user.id, type, identityKey, [targetKey]: id }
    });
    return res.json({ data: { bookmarked: true } });
  }));

  router.get('/experts', asyncRoute(async (req, res) => {
    const { page, limit, q } = parseInput(pagingSchema, req.query);
    const where = {
      status: 'VERIFIED', isDemo: false, user: { status: 'ACTIVE', role: 'EXPERT' },
      ...(q ? { OR: [{ companyName: { contains: q, mode: 'insensitive' } }, { roleTitle: { contains: q, mode: 'insensitive' } }, { user: { name: { contains: q, mode: 'insensitive' } } }] } : {})
    };
    const [mentors, total] = await prisma.$transaction([
      prisma.mentorProfile.findMany({
        where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit,
        include: { user: { select: { name: true, avatar: true } }, _count: { select: { reviews: true } } }
      }),
      prisma.mentorProfile.count({ where })
    ]);
    res.json({ data: { experts: mentors.map(({ user, _count, ...mentor }) => ({
      ...mentor, name: user?.name || 'Expert', avatar: user?.avatar, reviewCount: _count.reviews
    })), pagination: pageData(page, limit, total) } });
  }));

  router.get('/experts/:id/availability', asyncRoute(async (req, res) => {
    const expert = await prisma.mentorProfile.findFirst({
      where: {
        id: req.params.id, status: 'VERIFIED', isDemo: false,
        user: { status: 'ACTIVE', role: 'EXPERT' }
      }
    });
    if (!expert) throw new ApiError(404, 'NOT_FOUND', 'Expert not found.');
    const slots = await prisma.availabilitySlot.findMany({
      where: { mentorId: expert.id, isAvailable: true, startsAt: { gt: new Date() } },
      orderBy: { startsAt: 'asc' },
      take: 100
    });
    res.json({ data: { slots } });
  }));

  router.post('/experts/:id/availability', requireAuth, requireRole('EXPERT'), asyncRoute(async (req, res) => {
    const input = parseInput(slotSchema, req.body);
    const profile = await prisma.mentorProfile.findUnique({ where: { ownerKey: `user:${req.user.id}` } });
    if (!profile || profile.id !== req.params.id || profile.status !== 'VERIFIED' || profile.isDemo) {
      throw new ApiError(403, 'FORBIDDEN', 'Only verified experts may publish availability.');
    }
    const slot = await prisma.availabilitySlot.create({
      data: {
        mentorId: profile.id, startsAt: new Date(input.startsAt), endsAt: new Date(input.endsAt),
        timeZone: input.timeZone, price: input.price
      }
    });
    res.status(201).json({ data: { slot } });
  }));

  router.post('/experts/apply', requireAuth, requireRole('STUDENT'), asyncRoute(async (req, res) => {
    const input = parseInput(expertApplicationSchema, req.body);
    const existing = await prisma.mentorProfile.findUnique({ where: { ownerKey: `user:${req.user.id}` }, select: { id: true } });
    if (existing) throw new ApiError(409, 'APPLICATION_EXISTS', 'An expert profile already exists for this account.');
    const profile = await prisma.mentorProfile.create({
      data: { ownerKey: `user:${req.user.id}`, userId: req.user.id, ...input, status: 'PENDING', isDemo: false }
    });
    res.status(201).json({ data: { expert: profile } });
  }));

  router.get('/bookings', requireAuth, asyncRoute(async (req, res) => {
    const bookings = await prisma.booking.findMany({
      where: req.user.role === 'EXPERT'
        ? { mentor: { userId: req.user.id } }
        : { studentId: req.user.id },
      orderBy: { startsAt: 'desc' },
      include: { mentor: { include: { user: { select: { name: true, avatar: true } } } }, review: true }
    });
    res.json({ data: { bookings } });
  }));

  router.post('/bookings', requireAuth, asyncRoute(async (req, res) => {
    const input = parseInput(bookingSchema, req.body);
    const slot = await prisma.availabilitySlot.findFirst({
      where: {
        id: input.slotId, isAvailable: true, startsAt: { gt: new Date() },
        mentor: {
          status: 'VERIFIED', isDemo: false,
          user: { status: 'ACTIVE', role: 'EXPERT' }
        }
      }
    });
    if (!slot) throw new ApiError(409, 'SLOT_UNAVAILABLE', 'This time slot is no longer available.');
    const booking = await prisma.$transaction(async (tx) => {
      const reserved = await tx.availabilitySlot.updateMany({
        where: { id: slot.id, isAvailable: true },
        data: { isAvailable: false }
      });
      if (reserved.count !== 1) throw new ApiError(409, 'SLOT_UNAVAILABLE', 'This time slot is no longer available.');
      return tx.booking.create({
        data: {
          studentId: req.user.id, mentorId: slot.mentorId, slotId: slot.id,
          startsAt: slot.startsAt, endsAt: slot.endsAt, timeZone: slot.timeZone,
          price: slot.price, currency: slot.currency, notes: input.notes
        },
        include: { mentor: { include: { user: { select: { name: true, avatar: true } } } } }
      });
    });
    res.status(201).json({ data: { booking } });
  }));

  router.patch('/bookings/:id/cancel', requireAuth, asyncRoute(async (req, res) => {
    const booking = await prisma.booking.findFirst({
      where: { id: req.params.id, studentId: req.user.id, status: 'CONFIRMED', startsAt: { gt: new Date() } },
      select: { id: true, slotId: true }
    });
    if (!booking) throw new ApiError(404, 'NOT_FOUND', 'Upcoming booking not found.');
    await prisma.$transaction(async (tx) => {
      const cancelled = await tx.booking.updateMany({
        where: { id: booking.id, status: 'CONFIRMED', startsAt: { gt: new Date() } },
        data: { status: 'CANCELLED', cancelledAt: new Date() }
      });
      if (cancelled.count !== 1) throw new ApiError(409, 'BOOKING_CHANGED', 'This booking has already changed.');
      await tx.availabilitySlot.update({ where: { id: booking.slotId }, data: { isAvailable: true } });
    });
    res.json({ data: { cancelled: true } });
  }));

  router.patch('/bookings/:id/complete', requireAuth, requireRole('EXPERT'), asyncRoute(async (req, res) => {
    const profile = await prisma.mentorProfile.findUnique({ where: { ownerKey: `user:${req.user.id}` } });
    if (!profile || profile.status !== 'VERIFIED' || profile.isDemo) {
      throw new ApiError(403, 'FORBIDDEN', 'Only verified experts may complete bookings.');
    }
    const updated = await prisma.booking.updateMany({
      where: {
        id: req.params.id, mentorId: profile.id, status: 'CONFIRMED',
        endsAt: { lt: new Date() }
      },
      data: { status: 'COMPLETED' }
    });
    if (updated.count !== 1) throw new ApiError(404, 'NOT_FOUND', 'Completed session not found.');
    res.json({ data: { completed: true } });
  }));

  router.post('/bookings/:id/review', requireAuth, asyncRoute(async (req, res) => {
    const input = parseInput(reviewSchema, req.body);
    const booking = await prisma.booking.findFirst({
      where: { id: req.params.id, studentId: req.user.id, status: 'COMPLETED', endsAt: { lt: new Date() } }
    });
    if (!booking) throw new ApiError(404, 'NOT_FOUND', 'Completed booking not found.');
    const review = await prisma.mentorReview.create({
      data: { bookingId: booking.id, mentorId: booking.mentorId, studentId: req.user.id, ...input }
    });
    res.status(201).json({ data: { review } });
  }));

  router.get('/admin/metrics', requireAuth, requireRole('ADMIN'), asyncRoute(async (req, res) => {
    const [pendingExperiences, approvedExperiences, flaggedExperiences, rejectedExperiences, pendingExperts, verifiedExperts, suspendedExperts] = await Promise.all([
      prisma.interviewExperience.count({ where: { status: 'PENDING' } }),
      prisma.interviewExperience.count({ where: { status: 'APPROVED' } }),
      prisma.interviewExperience.count({ where: { status: 'FLAGGED' } }),
      prisma.interviewExperience.count({ where: { status: 'REJECTED' } }),
      prisma.mentorProfile.count({ where: { status: 'PENDING' } }),
      prisma.mentorProfile.count({ where: { status: 'VERIFIED' } }),
      prisma.mentorProfile.count({ where: { status: 'SUSPENDED' } })
    ]);
    res.json({
      data: {
        experiences: { PENDING: pendingExperiences, APPROVED: approvedExperiences, FLAGGED: flaggedExperiences, REJECTED: rejectedExperiences },
        experts: { PENDING: pendingExperts, VERIFIED: verifiedExperts, SUSPENDED: suspendedExperts }
      }
    });
  }));

  router.get('/admin/experiences', requireAuth, requireRole('ADMIN'), asyncRoute(async (req, res) => {
    const { page, limit, status } = parseInput(adminExperienceQuerySchema, req.query);
    const where = { status };
    const [experiences, total] = await prisma.$transaction([
      prisma.interviewExperience.findMany({
        where, orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit, take: limit,
        include: { rounds: { orderBy: { position: 'asc' } }, author: { select: { name: true, email: true } }, company: true }
      }),
      prisma.interviewExperience.count({ where })
    ]);
    res.json({ data: { experiences, pagination: pageData(page, limit, total) } });
  }));

  router.patch('/admin/experiences/:id', requireAuth, requireRole('ADMIN'), asyncRoute(async (req, res) => {
    const { status } = parseInput(moderationSchema, req.body);
    const experience = await prisma.$transaction(async (tx) => {
      const updated = await tx.interviewExperience.update({
        where: { id: req.params.id },
        data: { status, verified: status === 'APPROVED' }
      });
      await tx.auditEvent.create({
        data: {
          actorId: req.user.id, action: `EXPERIENCE_${status}`, entityType: 'InterviewExperience',
          entityId: updated.id, metadata: { status }
        }
      });
      return updated;
    });
    res.json({ data: { experience } });
  }));

  router.get('/admin/experts', requireAuth, requireRole('ADMIN'), asyncRoute(async (req, res) => {
    const profiles = await prisma.mentorProfile.findMany({
      where: { status: 'PENDING' }, orderBy: { createdAt: 'asc' },
      include: { user: { select: { name: true, email: true } } }
    });
    res.json({ data: { experts: profiles } });
  }));

  router.patch('/admin/experts/:id', requireAuth, requireRole('ADMIN'), asyncRoute(async (req, res) => {
    const statusSchema = z.object({ status: z.enum(['VERIFIED', 'REJECTED', 'SUSPENDED']) });
    const { status } = parseInput(statusSchema, req.body);
    const mentorStatus = status === 'REJECTED' ? 'SUSPENDED' : status;
    const profile = await prisma.$transaction(async (tx) => {
      const updated = await tx.mentorProfile.update({ where: { id: req.params.id }, data: { status: mentorStatus } });
      if (mentorStatus === 'VERIFIED' && updated.userId) {
        await tx.user.update({ where: { id: updated.userId }, data: { role: 'EXPERT' } });
      }
      await tx.auditEvent.create({
        data: { actorId: req.user.id, action: `EXPERT_${status}`, entityType: 'MentorProfile', entityId: updated.id, metadata: { status } }
      });
      return updated;
    });
    res.json({ data: { expert: profile } });
  }));

  return router;
}
