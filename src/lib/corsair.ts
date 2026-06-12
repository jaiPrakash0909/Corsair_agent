import { Pool } from "pg";
import { createCorsair } from "corsair";
import { gmail } from "@corsair-dev/gmail";
import { googlecalendar } from "@corsair-dev/googlecalendar";

const globalForCorsair = globalThis as unknown as {
  corsairPool?: Pool;
  corsairInstance?: ReturnType<typeof createCorsair>;
};

const pool =
  globalForCorsair.corsairPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL
  });

export const corsair =
  globalForCorsair.corsairInstance ??
  createCorsair({
    multiTenancy: true,
    database: pool,
    kek: process.env.CORSAIR_KEK!,
    plugins: [gmail(), googlecalendar()]
  });

if (process.env.NODE_ENV !== "production") {
  globalForCorsair.corsairPool = pool;
  globalForCorsair.corsairInstance = corsair;
}

export function getCorsairTenant(userId: string) {
  return corsair.withTenant(userId);
}
