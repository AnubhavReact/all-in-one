import path from "node:path";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

/**
 * Only the Prisma CLI reads this file — `db push`, `migrate`, `studio`.
 *
 * Secrets live in one .env at the repo root rather than one per package, so
 * this reaches up two levels to find it.
 */
loadEnv({ path: path.resolve(__dirname, "../../.env"), quiet: true });

/**
 * DIRECT_URL, not DATABASE_URL: schema changes need a plain connection, and
 * the pooled one Supabase hands out cannot run them. The app itself connects
 * through DATABASE_URL via the adapter in src/index.ts.
 *
 * It is left unset rather than defaulted, so `prisma generate` still works
 * before anyone has a database — generating the client needs no connection.
 */
const url = process.env.DIRECT_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  ...(url ? { datasource: { url } } : {}),
});
