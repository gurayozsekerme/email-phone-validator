// src/server.js
import Fastify from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

console.log('🔍 SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('🔍 SERVICE KEY var mı?', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('📁 .env dosya yolu:', path.resolve(__dirname, '..', '.env'));

import demoRoutes from './routes/demo.js';
import apiKeyAuth from './middleware/apiKeyAuth.js';
import rateLimiter from './services/rateLimiter.js';
import validateRoutes from './routes/validate.js';
import usageRoutes from './routes/usage.js';

const fastify = Fastify({
  logger: true,
  trustProxy: true
});

await fastify.register(demoRoutes);
await fastify.register(fastifyPlugin(apiKeyAuth));
await fastify.register(fastifyPlugin(rateLimiter));
await fastify.register(validateRoutes, { prefix: '/v1' });
await fastify.register(usageRoutes, { prefix: '/v1' });

const start = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    const HOST = '0.0.0.0';
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();