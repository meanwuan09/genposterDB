import { createReadStream } from 'node:fs';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { idParamsSchema, imageListQuerySchema, imageMetadataSchema, imagePatchSchema } from './image.schemas.js';
import * as imageService from './image.service.js';

export async function uploadImage(request: FastifyRequest, reply: FastifyReply) {
  const file = await request.file();

  if (!file) {
    return reply.code(400).send({ message: 'Image file is required' });
  }

  const fields = file.fields as Record<string, { value?: unknown } | undefined>;
  const metadata = imageMetadataSchema.parse({
    title: fields.title?.value,
    description: fields.description?.value,
    altText: fields.altText?.value,
    tags: fields.tags?.value
  });
  const image = await imageService.uploadImage(file, metadata);

  return reply.code(201).send(image);
}

export async function listImages(request: FastifyRequest) {
  const query = imageListQuerySchema.parse(request.query);
  return imageService.listImages(query);
}

export async function getImage(request: FastifyRequest) {
  const params = idParamsSchema.parse(request.params);
  return imageService.getImage(params.id);
}

export async function updateImage(request: FastifyRequest) {
  const params = idParamsSchema.parse(request.params);
  const body = imagePatchSchema.parse(request.body);

  return imageService.updateImage(params.id, body);
}

export async function deleteImage(request: FastifyRequest) {
  const params = idParamsSchema.parse(request.params);
  return imageService.softDeleteImage(params.id);
}

export async function restoreImage(request: FastifyRequest) {
  const params = idParamsSchema.parse(request.params);
  return imageService.restoreImage(params.id);
}

export async function streamImageFile(request: FastifyRequest, reply: FastifyReply) {
  const params = idParamsSchema.parse(request.params);
  const image = await imageService.getImage(params.id);
  const filePath = await imageService.getImageFilePath(params.id);

  return reply.type(image.mimeType).send(createReadStream(filePath));
}
