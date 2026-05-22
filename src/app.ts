import multipart from '@fastify/multipart';
import Fastify from 'fastify';
import { ZodError } from 'zod';
import { prisma } from './db/prisma.js';
import { env } from './config/env.js';
import { HttpError } from './utils/http-errors.js';
import { imageRoutes } from './modules/images/image.routes.js';

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(multipart, {
    limits: {
      fileSize: env.MAX_UPLOAD_BYTES
    }
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof HttpError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }

    if (error instanceof ZodError) {
      return reply.code(400).send({ message: 'Validation failed', issues: error.issues });
    }

    app.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  });

  app.get('/health', async () => ({ status: 'ok' }));

  app.get('/health/db', async () => {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'ok' };
  });

  app.register(imageRoutes, { prefix: '/api/v1' });

  return app;
}
