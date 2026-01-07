// src/middleware/apiKeyAuth.js
import { createClient } from '@supabase/supabase-js';

export default async function apiKeyAuth(fastify, options) {
  fastify.addHook('onRequest', async (request, reply) => {
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      return reply.status(401).send({ error: 'Missing X-API-Key header' });
    }

    // Supabase istemcisini HOOK içinden oluştur
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, user_id, quota_limit, is_active')
      .eq('key', apiKey)
      .single();

    if (error || !data || !data.is_active) {
      return reply.status(403).send({ error: 'Invalid or inactive API key' });
    }

    request.user = { id: data.user_id, quotaLimit: data.quota_limit };
  });
}