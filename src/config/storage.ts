import path from 'node:path';
import { env } from './env.js';

export const storageConfig = {
  root: path.resolve(env.STORAGE_ROOT),
  imagesRoot: path.resolve(env.STORAGE_ROOT, 'images')
};
