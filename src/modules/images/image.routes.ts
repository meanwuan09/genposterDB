import type { FastifyInstance } from 'fastify';
import * as imageController from './image.controller.js';

export async function imageRoutes(app: FastifyInstance) {
  app.post('/images', imageController.uploadImage);
  app.get('/images', imageController.listImages);
  app.get('/images/:id', imageController.getImage);
  app.patch('/images/:id', imageController.updateImage);
  app.delete('/images/:id', imageController.deleteImage);
  app.post('/images/:id/restore', imageController.restoreImage);
  app.get('/images/:id/file', imageController.streamImageFile);
}
