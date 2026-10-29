import test from 'node:test';
import assert from 'node:assert/strict';

process.env.MONGODB_URI ||= 'mongodb://127.0.0.1:27017/intelligrid_test?replicaSet=rs0';
process.env.SESSION_SECRET ||= 'test-only-secret-that-is-long-enough-123456';
process.env.NODE_ENV = 'test';

const { createApp } = await import('../app.js');

test('serves health checks and structured API errors without database access', async (t) => {
  const { io, server } = createApp();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  t.after(async () => {
    await new Promise((resolve) => io.close(resolve));
  });

  const health = await fetch(`${baseUrl}/api/health`);
  assert.equal(health.status, 200);
  assert.deepEqual((await health.json()).data, { status: 'ok' });

  const unauthorized = await fetch(`${baseUrl}/api/auth/me`);
  assert.equal(unauthorized.status, 200);
  assert.deepEqual((await unauthorized.json()).data, { user: null });

  const missing = await fetch(`${baseUrl}/api/does-not-exist`);
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).error.code, 'NOT_FOUND');
});
