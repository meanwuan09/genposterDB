import sharp from 'sharp';

export async function readImageMetadata(buffer: Buffer) {
  const metadata = await sharp(buffer).metadata();

  return {
    width: metadata.width ?? null,
    height: metadata.height ?? null,
    format: metadata.format ?? null
  };
}
