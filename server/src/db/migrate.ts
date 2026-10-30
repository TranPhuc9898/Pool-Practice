import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

/** Chạy ở pre-deploy của Railway: migrate hỏng thì exit khác 0, deploy mới không lên. */
const sql = postgres(process.env.DATABASE_URL ?? '', { max: 1 });

try {
  await migrate(drizzle(sql), { migrationsFolder: new URL('../../drizzle', import.meta.url).pathname });
  console.log('migrations applied');
} finally {
  await sql.end({ timeout: 5 });
}
