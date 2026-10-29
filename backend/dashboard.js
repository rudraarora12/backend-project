import { Router } from 'express';
import { z } from 'zod';
import { prisma } from './db.js';
import { ApiError, asyncRoute, parseInput } from './errors.js';
import { requireAuth, publicUser } from './auth.js';

const trackSchema = z.object({
  track: z.enum(['amazon', 'google', 'microsoft'])
});

const milestoneSchema = z.object({
  milestoneId: z.string().min(1).max(100),
  status: z.enum(['completed', 'in_progress', 'todo'])
});

const challengeSchema = z.object({
  challengeId: z.string().min(1).max(100),
  status: z.enum(['Todo', 'In Progress', 'Solved'])
});

const profileUpdateSchema = z.object({
  graduationYear: z.number().int().min(2000).max(2035).optional(),
  college: z.string().trim().max(150).optional(),
  degree: z.string().trim().max(150).optional()
});

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

export function dashboardRouter() {
  const router = Router();

  // GET user dashboard state from MongoDB
  router.get('/dashboard', requireAuth, asyncRoute(async (req, res) => {
    const userId = req.user.id;

    const findResult = await prisma.$runCommandRaw({
      find: 'user_dashboards',
      filter: { userId }
    });

    let doc = findResult.cursor?.firstBatch?.[0] || null;

    if (!doc) {
      // Create initial document in MongoDB
      const initialDoc = {
        userId,
        activeTrack: 'amazon',
        milestones: {
          'm-amz-1': 'completed',
          'm-amz-2': 'completed',
          'm-amz-3': 'in_progress',
          'm-amz-4': 'todo'
        },
        challenges: {},
        heatmap: {
          [getTodayString()]: 3
        },
        stats: {
          totalSolved: 479,
          streak: 14
        },
        updatedAt: new Date().toISOString()
      };

      await prisma.$runCommandRaw({
        insert: 'user_dashboards',
        documents: [initialDoc]
      });

      doc = initialDoc;
    }

    res.json({
      data: {
        dashboard: doc,
        user: publicUser(req.user)
      }
    });
  }));

  // Update active target track in MongoDB
  router.post('/dashboard/track', requireAuth, asyncRoute(async (req, res) => {
    const { track } = parseInput(trackSchema, req.body);
    const userId = req.user.id;

    await prisma.$runCommandRaw({
      update: 'user_dashboards',
      updates: [
        {
          q: { userId },
          u: {
            $set: {
              activeTrack: track,
              updatedAt: new Date().toISOString()
            }
          },
          upsert: true
        }
      ]
    });

    res.json({ data: { activeTrack: track } });
  }));

  // Update milestone status in MongoDB
  router.post('/dashboard/milestone', requireAuth, asyncRoute(async (req, res) => {
    const { milestoneId, status } = parseInput(milestoneSchema, req.body);
    const userId = req.user.id;

    await prisma.$runCommandRaw({
      update: 'user_dashboards',
      updates: [
        {
          q: { userId },
          u: {
            $set: {
              [`milestones.${milestoneId}`]: status,
              updatedAt: new Date().toISOString()
            }
          },
          upsert: true
        }
      ]
    });

    res.json({ data: { milestoneId, status } });
  }));

  // Update practice problem status in MongoDB
  router.post('/dashboard/challenge', requireAuth, asyncRoute(async (req, res) => {
    const { challengeId, status } = parseInput(challengeSchema, req.body);
    const userId = req.user.id;
    const today = getTodayString();

    const updateOps = {
      $set: {
        [`challenges.${challengeId}`]: status,
        updatedAt: new Date().toISOString()
      }
    };

    // If marked solved, increment today's heatmap counter in MongoDB
    if (status === 'Solved') {
      updateOps.$inc = {
        [`heatmap.${today}`]: 1,
        'stats.totalSolved': 1
      };
    }

    await prisma.$runCommandRaw({
      update: 'user_dashboards',
      updates: [
        {
          q: { userId },
          u: updateOps,
          upsert: true
        }
      ]
    });

    res.json({ data: { challengeId, status } });
  }));

  // Update academic info (Graduation Year, College, Degree) in MongoDB User model
  router.patch('/dashboard/profile', requireAuth, asyncRoute(async (req, res) => {
    const updates = parseInput(profileUpdateSchema, req.body);
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updates
    });

    res.json({ data: { user: publicUser(updatedUser) } });
  }));

  return router;
}
