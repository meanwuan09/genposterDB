import { getAccessToken } from './auth';

const apiBaseUrl = process.env.API_BASE_URL ?? 'http://127.0.0.1:3000/api/v1';

async function fetchWithRetry(input: string, init: RequestInit, attempts = 5) {
  let lastError: unknown;

  for (let index = 0; index < attempts; index += 1) {
    try {
      return await fetch(input, init);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 250 * (index + 1)));
    }
  }

  throw lastError;
}

export async function apiGet<T>(path: string) {
  const token = await getAccessToken();
  const response = await fetchWithRetry(`${apiBaseUrl}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: 'no-store'
  });

  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export function apiBase() {
  return apiBaseUrl;
}
