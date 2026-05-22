import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get('email') ?? '');
  const password = String(form.get('password') ?? '');

  const response = await fetch(`${process.env.API_BASE_URL ?? 'http://127.0.0.1:3000/api/v1'}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    redirect('/login?error=1');
  }

  const data = (await response.json()) as { accessToken: string };
  (await cookies()).set('accessToken', data.accessToken, { httpOnly: true, sameSite: 'lax', path: '/' });
  redirect('/places');
}
