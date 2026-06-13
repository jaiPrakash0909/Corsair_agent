import { Pool } from "pg";
import { createCorsair } from "corsair";
import { setupCorsair } from "corsair/setup";
import { gmail } from "@corsair-dev/gmail";
import { googlecalendar } from "@corsair-dev/googlecalendar";

const globalForCorsair = globalThis as unknown as {
  corsairPool?: Pool;
  corsairInstance?: ReturnType<typeof createCorsair>;
  corsairSetupPromises?: Map<string, Promise<void>>;
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

const setupPromises = globalForCorsair.corsairSetupPromises ?? new Map<string, Promise<void>>();

if (process.env.NODE_ENV !== "production") {
  globalForCorsair.corsairSetupPromises = setupPromises;
}

function getSetupCredentials() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return undefined;
  }

  return {
    gmail: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET
    },
    googlecalendar: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET
    }
  };
}

export async function ensureCorsairTenantSetup(userId: string) {
  const existing = setupPromises.get(userId);
  if (existing) {
    return existing;
  }

  const setupPromise = setupCorsair(corsair, {
    tenantId: userId,
    credentials: getSetupCredentials()
  }).then(() => undefined);

  setupPromises.set(userId, setupPromise);
  return setupPromise;
}

export function getCorsairTenant(userId: string) {
  return corsair.withTenant(userId);
}
