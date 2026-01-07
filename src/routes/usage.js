// src/routes/usage.js
import { createClient } from '@supabase/supabase-js';

export default async function usageRoutes(fastify, options) {
  fastify.get('/usage', async (request, reply) => {
    const userId = request.user.id;

    // İstemciyi istek anında oluştur
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from('usage_logs')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (error) {
      return reply.status(500).send({ error: 'Failed to fetch usage' });
    }

    return { total_requests: data.length };
  });
}