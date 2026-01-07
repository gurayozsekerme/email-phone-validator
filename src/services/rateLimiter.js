// src/services/rateLimiter.js
import { redis } from '../utils/redis.js';

export default async function rateLimiter(fastify, options) {
  fastify.addHook('onRequest', async (request, reply) => {
    const apiKey = request.headers['x-api-key'];
    if (!apiKey) return; // apiKeyAuth zaten kontrol eder

    const key = `ratelimit:${apiKey}`;
    const maxRequests = request.user?.quotaLimit || 20;
    const windowSec = 86400; // 24 saat

    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, windowSec);
    }

    if (current > maxRequests) {
      return reply.status(429).send({
        error: 'Rate limit exceeded',
        limit: maxRequests,
        reset_in_seconds: windowSec
      });
    }

    reply.header('X-RateLimit-Limit', maxRequests);
    reply.header('X-RateLimit-Remaining', Math.max(0, maxRequests - current));
  });
}