import session from 'express-session';
import { prisma } from './db.js';

export class PrismaSessionStore extends session.Store {
  async get(sid, callback) {
    try {
      const saved = await prisma.authSession.findUnique({ where: { sid } });
      if (!saved || saved.expiresAt <= new Date()) {
        if (saved) await prisma.authSession.deleteMany({ where: { sid } });
        return callback(null, null);
      }
      return callback(null, saved.data);
    } catch (error) {
      return callback(error);
    }
  }

  async set(sid, data, callback = () => {}) {
    try {
      const expiresAt = data.cookie?.expires ? new Date(data.cookie.expires) : new Date(Date.now() + 86400000);
      await prisma.authSession.upsert({
        where: { sid },
        create: { sid, data, expiresAt, userId: data.userId || null },
        update: { data, expiresAt, userId: data.userId || null }
      });
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  async touch(sid, data, callback = () => {}) {
    try {
      const expiresAt = data.cookie?.expires ? new Date(data.cookie.expires) : new Date(Date.now() + 86400000);
      await prisma.authSession.updateMany({
        where: { sid },
        data: { expiresAt, userId: data.userId || null }
      });
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  async destroy(sid, callback = () => {}) {
    try {
      await prisma.authSession.deleteMany({ where: { sid } });
      callback(null);
    } catch (error) {
      callback(error);
    }
  }
}
