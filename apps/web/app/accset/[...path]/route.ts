import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.jfif': 'image/jpeg'
};

function resolveAccsetRoot() {
  const candidates = [
    path.resolve(process.cwd(), 'accset'),
    path.resolve(process.cwd(), '../../accset'),
    path.resolve(process.cwd(), '../accset')
  ];

  const root = candidates.find((candidate) => existsSync(candidate));
  return root ? path.resolve(root) : candidates[0];
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const root = resolveAccsetRoot();
  const filePath = path.resolve(root, ...segments.map((segment) => decodeURIComponent(segment)));

  if (!filePath.startsWith(root + path.sep)) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const file = await readFile(filePath);
    const contentType = mimeTypes[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream';
    return new NextResponse(file, { headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=3600' } });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
