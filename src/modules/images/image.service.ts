import type { MultipartFile } from '@fastify/multipart';
import { notFound, validationError } from '../../utils/http-errors.js';
import { sha256 } from '../../utils/checksum.js';
import { createStoredImagePath, removeFileIfExists, safeStoragePath, writeImageFile } from '../../utils/filesystem.js';
import { readImageMetadata } from '../../utils/image-metadata.js';
import { env } from '../../config/env.js';
import { allowedImageMimeTypes, normalizeTags } from './image.schemas.js';
import * as imageRepository from './image.repository.js';

export type UploadMetadataInput = {
  title?: string;
  description?: string;
  altText?: string;
  tags?: unknown;
};

export async function uploadImage(file: MultipartFile, metadata: UploadMetadataInput) {
  if (!allowedImageMimeTypes.includes(file.mimetype as (typeof allowedImageMimeTypes)[number])) {
    throw validationError('Unsupported image MIME type');
  }

  const buffer = await file.toBuffer();

  if (buffer.length === 0) {
    throw validationError('Image file is empty');
  }

  if (buffer.length > env.MAX_UPLOAD_BYTES) {
    throw validationError('Image file is too large');
  }

  const imageMetadata = await readImageMetadata(buffer).catch(() => {
    throw validationError('Uploaded file is not a valid image');
  });

  const storedPath = createStoredImagePath(file.mimetype);
  const checksumSha256 = sha256(buffer);

  await writeImageFile(storedPath.absolutePath, buffer);

  try {
    return await imageRepository.createImage({
      originalFilename: file.filename,
      storedFilename: storedPath.storedFilename,
      relativePath: storedPath.relativePath,
      mimeType: file.mimetype,
      extension: storedPath.extension,
      sizeBytes: buffer.length,
      width: imageMetadata.width,
      height: imageMetadata.height,
      checksumSha256,
      title: metadata.title,
      description: metadata.description,
      altText: metadata.altText,
      tags: normalizeTags(metadata.tags)
    });
  } catch (error) {
    await removeFileIfExists(storedPath.absolutePath);
    throw error;
  }
}

export async function listImages(input: imageRepository.ListImagesInput) {
  return imageRepository.listImages(input);
}

export async function getImage(id: string) {
  const image = await imageRepository.findImageById(id);

  if (!image) {
    throw notFound('Image not found');
  }

  return image;
}

export async function updateImage(id: string, input: UploadMetadataInput) {
  await getImage(id);

  return imageRepository.updateImageMetadata(id, {
    title: input.title,
    description: input.description,
    altText: input.altText,
    tags: normalizeTags(input.tags)
  });
}

export async function softDeleteImage(id: string) {
  await getImage(id);
  return imageRepository.softDeleteImage(id);
}

export async function restoreImage(id: string) {
  await getImage(id);
  return imageRepository.restoreImage(id);
}

export async function getImageFilePath(id: string) {
  const image = await getImage(id);

  if (image.status !== 'ACTIVE') {
    throw notFound('Image file not found');
  }

  return safeStoragePath(image.relativePath);
}
