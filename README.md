# genposterDB

Admin platform for restaurant/place data.

## Requirements

- Node.js 18+
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

## Run Through Cloudflare Tunnel

Run the web app on all interfaces:

```bash
cd apps/web
npx next dev --webpack -H 0.0.0.0 -p 3001
```

In another terminal:

```bash
cloudflared tunnel --url http://localhost:3001
```

Next.js dev mode blocks unknown tunnel origins unless they are listed in
`apps/web/next.config.ts`. This project allows `*.trycloudflare.com` for dev
tunnels.
