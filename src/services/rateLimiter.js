// src/services/rateLimiter.js
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

export default async function rateLimiter(fastify, options) {
  fastify.addHook('onRequest', async (request, reply) => {
    const apiKey = request.headers['x-api-key'];
    const key = `rate_limit:${apiKey}`;
    const maxRequests = request.user?.quotaLimit || 20; // Varsayılan 20 (demo için)
    const windowMs = 24 * 60 * 60 * 1000; // 24 saat

    const current = await redis.incr(key);
    if (current === 1) {
      await redis.pexpire(key, windowMs);
    }

    if (current > maxRequests) {
      return reply.status(429).send({
        error: 'Rate limit exceeded',
        limit: maxRequests,
        reset: new Date(Date.now() + windowMs).toISOString()
      });
    }

    reply.header('X-RateLimit-Limit', maxRequests);
    reply.header('X-RateLimit-Remaining', Math.max(0, maxRequests - current));
  });
}