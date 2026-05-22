import { describe, expect, it } from 'vitest';
import { normalizeTags } from '../../src/modules/images/image.schemas.js';

describe('normalizeTags', () => {
  it('normalizes comma-separated tags', () => {
    expect(normalizeTags(' Cat, summer, CAT ,,  archive ')).toEqual(['cat', 'summer', 'archive']);
  });

  it('normalizes array tags', () => {
    expect(normalizeTags([' Product ', 'product', 'Document'])).toEqual(['product', 'document']);
  });
});
