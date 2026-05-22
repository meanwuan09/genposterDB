import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { storageConfig } from '../config/storage.js';

const extensionByMimeType = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp']
]);

export function extensionFromMimeType(mimeType: string) {
  return extensionByMimeType.get(mimeType);
}

export function createStoredImagePath(mimeType: string, now = new Date()) {
  const extension = extensionFromMimeType(mimeType);

  if (!extension) {
    throw new Error('Unsupported image type');
  }

  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const storedFilename = `${randomUUID()}.${extension}`;
  const relativePath = path.posix.join('images', year, month, day, storedFilename);
  const absolutePath = safeStoragePath(relativePath);

  return { storedFilename, relativePath, absolutePath, extension };
}

export function safeStoragePath(relativePath: string) {
  const normalized = path.normalize(relativePath);
  const absolutePath = path.resolve(storageConfig.root, normalized);
  const relativeToRoot = path.relative(storageConfig.root, absolutePath);

  if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) {
    throw new Error('Invalid storage path');
  }

  return absolutePath;
}

export async function writeImageFile(absolutePath: string, buffer: Buffer) {
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, buffer, { flag: 'wx' });
}

export async function removeFileIfExists(absolutePath: string) {
  await rm(absolutePath, { force: true });
}
