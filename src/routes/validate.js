// src/routes/validate.js
import emailValidator from '../services/emailValidator.js';
import phoneValidator from '../services/phoneValidator.js';
import { createClient } from '@supabase/supabase-js';

async function logUsage(userId, type) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  await supabase.from('usage_logs').insert({
    user_id: userId,
    validation_type: type,
    timestamp: new Date().toISOString()
  });
}

export default async function validateRoutes(fastify, options) {
  fastify.post('/validate/email', async (request, reply) => {
    const { email } = request.body;
    if (!email || typeof email !== 'string') {
      return reply.status(400).send({ error: 'Email is required' });
    }

    const result = await emailValidator(email);
    if (!result.valid) {
      return reply.status(400).send(result);
    }

    await logUsage(request.user.id, 'email');
    return reply.send(result);
  });

  fastify.post('/validate/phone', async (request, reply) => {
    const { phone } = request.body;
    if (!phone || typeof phone !== 'string') {
      return reply.status(400).send({ error: 'Phone number is required' });
    }

    const result = phoneValidator(phone);
    if (!result.valid) {
      return reply.status(400).send(result);
    }

    await logUsage(request.user.id, 'phone');
    return reply.send(result);
  });
}