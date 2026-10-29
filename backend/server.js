import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDatabase, prisma } from './db.js';

const currentFile = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(currentFile), '..');
dotenv.config({ path: path.join(projectRoot, '.env') });

async function start() {
  await connectDatabase();

  const { io, server } = createApp();
  const port = Number(process.env.PORT || 3001);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, resolve);
  });
  console.log(JSON.stringify({ level: 'info', message: 'API server listening', port }));

  let shuttingDown = false;
  async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(JSON.stringify({ level: 'info', message: 'Shutting down API server', signal }));
    const timeout = setTimeout(() => process.exit(1), 10000);
    timeout.unref();
    try {
      await new Promise((resolve) => io.close(resolve));
      await prisma.$disconnect();
    } catch (error) {
      console.error(JSON.stringify({
        level: 'error',
        message: 'API shutdown failed',
        code: error?.code,
        detail: error instanceof Error ? error.message : String(error)
      }));
      process.exitCode = 1;
    }
    process.exit(process.exitCode || 0);
  }

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

start().catch(async (error) => {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(JSON.stringify({
    level: 'error',
    message: 'API startup failed',
    code: error?.code,
    detail,
    hint: error?.hint || 'Check MONGODB_URI, verify Atlas reachability, and confirm the backend port is available.'
  }));
  await prisma.$disconnect();
  process.exitCode = 1;
});
