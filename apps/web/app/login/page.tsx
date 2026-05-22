export default function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <section className="page">
      <div>
        <h1>Login</h1>
        <p className="muted">Đăng nhập bằng tài khoản đã được cấp trong database.</p>
      </div>
      <form className="form-card card" action="/api/auth/login" method="post">
        <LoginError searchParams={searchParams} />
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required defaultValue="admin@example.com" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required defaultValue="admin123" />
        </div>
        <button type="submit">Login</button>
      </form>
    </section>
  );
}

async function LoginError({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return params.error ? <p className="badge off">Login failed</p> : null;
}
