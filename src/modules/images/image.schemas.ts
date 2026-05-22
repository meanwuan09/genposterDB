import { z } from 'zod';

export const allowedImageMimeTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const idParamsSchema = z.object({
  id: z.string().uuid()
});

export const imageMetadataSchema = z.object({
  title: z.string().trim().max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  altText: z.string().trim().max(500).optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional()
});

export const imageListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(25),
  status: z.enum(['ACTIVE', 'DELETED', 'PURGED']).optional(),
  tag: z.string().trim().min(1).optional(),
  q: z.string().trim().min(1).optional(),
  includeDeleted: z.coerce.boolean().default(false)
});

export const imagePatchSchema = imageMetadataSchema.partial();

export function normalizeTags(value: unknown) {
  const values = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];

  return [...new Set(values.map((tag) => tag.trim().toLowerCase()).filter(Boolean))].slice(0, 25);
}
