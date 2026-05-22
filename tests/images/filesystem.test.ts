import { beforeAll, describe, expect, it } from 'vitest';

let filesystem: typeof import('../../src/utils/filesystem.js');

beforeAll(async () => {
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/test';
  process.env.STORAGE_ROOT = './storage';
  filesystem = await import('../../src/utils/filesystem.js');
});

describe('filesystem helpers', () => {
  it('maps supported MIME types to extensions', () => {
    expect(filesystem.extensionFromMimeType('image/jpeg')).toBe('jpg');
    expect(filesystem.extensionFromMimeType('image/png')).toBe('png');
    expect(filesystem.extensionFromMimeType('image/webp')).toBe('webp');
  });

  it('creates dated relative paths for images', () => {
    const result = filesystem.createStoredImagePath('image/png', new Date('2026-05-19T00:00:00Z'));

    expect(result.extension).toBe('png');
    expect(result.relativePath).toMatch(/^images\/2026\/05\/19\/.+\.png$/);
  });

  it('rejects paths outside the storage root', () => {
    expect(() => filesystem.safeStoragePath('../outside.png')).toThrow('Invalid storage path');
  });
});
