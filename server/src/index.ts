import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import postgres from 'postgres';

/** `DATABASE_URL` trên Railway trỏ Postgres qua private network, không ra domain public. */
const sql = postgres(process.env.DATABASE_URL ?? '', { max: 5 });

const app = new Hono();

/** Healthcheck của Railway gọi đường này: DB không trả lời thì 503 để deploy không lên. */
app.get('/health', async (c) => {
  try {
    await sql`select 1`;
    return c.json({ ok: true, db: true });
  } catch {
    return c.json({ ok: false, db: false }, 503);
  }
});

const server = serve({ fetch: app.fetch, port: Number(process.env.PORT ?? 3000) }, (info) =>
  console.log(`api listening on ${info.port}`),
);

process.on('SIGTERM', () => {
  server.close();
  void sql.end({ timeout: 5 });
});
