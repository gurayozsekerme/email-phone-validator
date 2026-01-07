// src/routes/demo.js
import emailValidator from '../services/emailValidator.js';

export default async function demoRoutes(fastify, options) {
  fastify.post('/demo/validate/email', async (request, reply) => {
    const { email } = request.body;
    if (!email || typeof email !== 'string') {
      return reply.status(400).send({ error: 'Email is required' });
    }

    const result = await emailValidator(email);
    return reply.send(result);
  });
}