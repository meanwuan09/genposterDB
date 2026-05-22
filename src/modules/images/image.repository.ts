import type { ImageStatus, Prisma } from '@prisma/client';
import { prisma } from '../../db/prisma.js';

export type CreateImageInput = Prisma.ImageCreateInput;

export type ListImagesInput = {
  page: number;
  pageSize: number;
  status?: ImageStatus;
  tag?: string;
  q?: string;
  includeDeleted: boolean;
};

export async function createImage(data: CreateImageInput) {
  return prisma.image.create({ data });
}

export async function listImages(input: ListImagesInput) {
  const where: Prisma.ImageWhereInput = {};

  if (input.status) {
    where.status = input.status;
  } else if (!input.includeDeleted) {
    where.status = 'ACTIVE';
  }

  if (input.tag) {
    where.tags = { has: input.tag.toLowerCase() };
  }

  if (input.q) {
    where.OR = [
      { title: { contains: input.q, mode: 'insensitive' } },
      { description: { contains: input.q, mode: 'insensitive' } },
      { originalFilename: { contains: input.q, mode: 'insensitive' } }
    ];
  }

  const [items, total] = await prisma.$transaction([
    prisma.image.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (input.page - 1) * input.pageSize,
      take: input.pageSize
    }),
    prisma.image.count({ where })
  ]);

  return { items, total, page: input.page, pageSize: input.pageSize };
}

export async function findImageById(id: string) {
  return prisma.image.findUnique({ where: { id } });
}

export async function updateImageMetadata(id: string, data: Prisma.ImageUpdateInput) {
  return prisma.image.update({ where: { id }, data });
}

export async function softDeleteImage(id: string) {
  return prisma.image.update({
    where: { id },
    data: { status: 'DELETED', deletedAt: new Date() }
  });
}

export async function restoreImage(id: string) {
  return prisma.image.update({
    where: { id },
    data: { status: 'ACTIVE', deletedAt: null }
  });
}
