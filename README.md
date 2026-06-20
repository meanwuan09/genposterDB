# genposterDB

Admin platform for restaurant/place data.

## Requirements

- Node.js 20+
- npm
- PostgreSQL, or Docker with Docker Compose

## Environment

The API uses Prisma with PostgreSQL. Create a `.env` file at the project root:

```env
DATABASE_URL="postgresql://postgres:040904@localhost:5433/image_metadata_api?schema=public"
API_PORT=3000
WEB_ORIGIN="http://localhost:3001"
API_BASE_URL="http://127.0.0.1:3000/api/v1"
NEXT_PUBLIC_API_BASE_URL="http://127.0.0.1:3000/api/v1"
JWT_SECRET="dev-secret"
```

If you use a different existing PostgreSQL server, update the username, password,
host, port, and database name in `DATABASE_URL`.

## Run With Docker Postgres

```bash
npm install
docker compose up -d
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

Open:

- Web: `http://localhost:3001`
- API health: `http://localhost:3000/health`

`npm run dev` runs both apps:

- API: `apps/api`, `http://localhost:3000`
- Web: `apps/web`, `http://0.0.0.0:3001`

For local-only web development, use:

```bash
npm run dev:local
```

Default seeded accounts:

- `admin@example.com` / `admin123`
- `staff@example.com` / `staff123`

## Fix Prisma P1000 Authentication Error

If the API fails with:

```text
PrismaClientInitializationError: Authentication failed against database server
errorCode: 'P1000'
```

then Prisma reached PostgreSQL, but the credentials in `DATABASE_URL` are wrong
for the running database.

For the included `docker-compose.yml`, the expected connection string is:

```env
DATABASE_URL="postgresql://postgres:040904@localhost:5433/image_metadata_api?schema=public"
```

If you already had a Postgres container with a different password, recreate the
project container and volume:

```bash
docker compose down -v
docker compose up -d
npm run prisma:migrate
npm run seed
```

If you are using the system PostgreSQL on Linux instead of Docker, set
`DATABASE_URL` to the real credentials for that server, commonly port `5432`.

## Run The Full Project On Linux

Install Node.js 20+ with `nvm`:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
node -v
```

Clone or enter the project:

```bash
cd ~/genposterDB
```

Create `.env`:

```bash
cat > .env <<'EOF'
DATABASE_URL="postgresql://postgres:040904@localhost:5433/image_metadata_api?schema=public"
API_PORT=3000
WEB_ORIGIN="http://localhost:3001"
API_BASE_URL="http://127.0.0.1:3000/api/v1"
NEXT_PUBLIC_API_BASE_URL="http://127.0.0.1:3000/api/v1"
JWT_SECRET="dev-secret"
EOF
```

Install dependencies and prepare the database:

```bash
npm install
docker compose up -d
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

Run API and web together:

```bash
npm run dev
```

In another terminal, verify both services:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/health/db
curl -I http://localhost:3001
```

Open the web app:

```text
http://localhost:3001
```

If accessing from another device on the same LAN, use the Linux machine IP:

```bash
ip addr
```

Then open:

```text
http://LINUX_IP:3001
```

If LAN access fails but local `curl` works, use Cloudflare Tunnel or check the
router/firewall network path.

## Run Through Cloudflare Tunnel

Run the full project first:

```bash
cd ~/genposterDB
npm run dev
```

In another terminal:

```bash
cloudflared tunnel --url http://localhost:3001
```

Open the generated `https://...trycloudflare.com` URL.

Next.js dev mode blocks unknown tunnel origins unless they are listed in
`apps/web/next.config.ts`. This project allows `*.trycloudflare.com` for dev
tunnels.

If using a fixed Cloudflare domain, set `WEB_ORIGIN` in `.env` to that domain
and restart `npm run dev`:

```env
WEB_ORIGIN="https://admin.example.com"
```
