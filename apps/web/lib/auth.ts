import { cookies } from 'next/headers';
import type { AuthUser } from './types';

const apiBaseUrl = process.env.API_BASE_URL ?? 'http://127.0.0.1:3000/api/v1';

async function fetchWithRetry(input: string, init: RequestInit, attempts = 5) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      return await fetch(input, init);
    } catch (error) {
      if (index === attempts - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 250 * (index + 1)));
    }
  }

  throw new Error('fetch failed');
}

export async function getAccessToken() {
  return (await cookies()).get('accessToken')?.value ?? null;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const response = await fetchWithRetry(`${apiBaseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });

  if (!response.ok) return null;
  const data = (await response.json()) as { user: AuthUser };
  return data.user;
}
