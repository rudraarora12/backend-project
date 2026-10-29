import { Router } from 'express';
import { z } from 'zod';
import { prisma } from './db.js';
import { ApiError, asyncRoute, parseInput } from './errors.js';
import { requireAuth } from './auth.js';
import { generateRuleBasedRoadmap } from './roadmap-generator.js';

const generateSchema = z.object({
  targetCompany: z.string().trim().min(1).max(100),
  targetRole: z.string().trim().min(1).max(120),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  durationDays: z.union([z.literal(7), z.literal(14), z.literal(30)]),
  dailyHours: z.number().int().min(1).max(12),
  focusAreas: z.array(z.string().trim().min(1).max(60)).max(12).default([])
});
const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20)
});
const taskSchema = z.object({ completed: z.boolean() });

function roadmapInclude() {
  return { days: { orderBy: { dayNumber: 'asc' }, include: { tasks: { orderBy: { title: 'asc' } } } } };
}

export function roadmapRouter() {
  const router = Router();

  router.post('/roadmaps/generate', requireAuth, asyncRoute(async (req, res) => {
    const input = parseInput(generateSchema, req.body);
    const company = input.targetCompany.toLowerCase() === 'general'
      ? null
      : await prisma.company.findUnique({ where: { slug: input.targetCompany.toLowerCase() } });
    if (input.targetCompany.toLowerCase() !== 'general' && !company) {
      throw new ApiError(400, 'INVALID_COMPANY', 'Choose a company from the company directory.');
    }

    const plan = generateRuleBasedRoadmap({
      days: input.durationDays,
      level: input.skillLevel,
      targetCompany: company?.name || 'General Campus Placement',
      role: input.targetRole,
      dailyHours: input.dailyHours,
      focusAreas: input.focusAreas
    });

    const roadmap = await prisma.roadmap.create({
      data: {
        userId: req.user.id,
        companyId: company?.id,
        targetCompany: company?.name || 'General Campus Placement',
        targetRole: input.targetRole,
        skillLevel: input.skillLevel,
        dailyHours: input.dailyHours,
        durationDays: input.durationDays,
        generationMethod: 'RULE_BASED',
        days: {
          create: plan.map((day) => ({
            dayNumber: day.dayNumber,
            title: day.title,
            focus: day.focus,
            proTip: day.proTip,
            estimatedMinutes: day.estimatedMinutes,
            tasks: { create: day.tasks }
          }))
        }
      },
      include: roadmapInclude()
    });
    res.status(201).json({ data: { roadmap } });
  }));

  router.get('/roadmaps', requireAuth, asyncRoute(async (req, res) => {
    const { page, limit } = parseInput(paginationSchema, req.query);
    const [roadmaps, total] = await prisma.$transaction([
      prisma.roadmap.findMany({
        where: { userId: req.user.id },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: roadmapInclude()
      }),
      prisma.roadmap.count({ where: { userId: req.user.id } })
    ]);
    res.json({ data: { roadmaps, pagination: { page, limit, total } } });
  }));

  router.get('/roadmaps/:id', requireAuth, asyncRoute(async (req, res) => {
    const roadmap = await prisma.roadmap.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: roadmapInclude()
    });
    if (!roadmap) throw new ApiError(404, 'NOT_FOUND', 'Roadmap not found.');
    res.json({ data: { roadmap } });
  }));

  router.patch('/roadmaps/:id/tasks/:taskId', requireAuth, asyncRoute(async (req, res) => {
    const input = parseInput(taskSchema, req.body);
    const task = await prisma.roadmapTask.findFirst({
      where: {
        id: req.params.taskId,
        day: { roadmapId: req.params.id, roadmap: { userId: req.user.id } }
      }
    });
    if (!task) throw new ApiError(404, 'NOT_FOUND', 'Roadmap task not found.');
    const updated = await prisma.roadmapTask.update({
      where: { id: task.id },
      data: { completed: input.completed }
    });
    const taskFilter = { day: { roadmapId: req.params.id } };
    const [totalTasks, doneTasks] = await Promise.all([
      prisma.roadmapTask.count({ where: taskFilter }),
      prisma.roadmapTask.count({ where: { ...taskFilter, completed: true } })
    ]);
    res.json({ data: { task: updated, progress: { completed: doneTasks, total: totalTasks, percent: totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0 } } });
  }));

  return router;
}
