import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentUser } from '../lib/auth';
import './globals.css';

export const metadata: Metadata = {
  title: 'Restaurant Admin',
  description: 'Admin and staff restaurant management'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="vi">
      <body>
        <div className="shell">
          <aside className="sidebar">
            <h1>Restaurant Admin</h1>
            <nav className="nav">
              <Link href="/places">Quán ăn</Link>
              <Link href="/places/new">Thêm quán</Link>
              <Link href="/images">Images</Link>
              {user ? <a href="/api/auth/logout">Logout ({user.role})</a> : <Link href="/login">Login</Link>}
            </nav>
          </aside>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
