// server/lib/db.ts
// ─────────────────────────────────────────────────────────────────────────────
// Prisma client singleton for Next.js App Router.
//
// Problem being solved:
//   Next.js hot-reload in development destroys and recreates every module on
//   every file save. Without the global cache, each reload instantiates a new
//   PrismaClient — each with its own connection pool. After a few reloads the
//   database runs out of connections and every query starts throwing
//   "Too many connections" errors.
//
// Solution:
//   Attach the single PrismaClient instance to `globalThis` (which survives
//   hot-reload). In production, module caching is stable so we just create one
//   instance at module-load time and it is reused for the lifetime of the
//   serverless function.
//
// Serverless (Vercel) notes:
//   Each Vercel function invocation may be a fresh cold start. The globalThis
//   approach still works because we prefer the cached instance when available
//   and only create a new one when none exists. Prisma Accelerate or PgBouncer
//   should be used for high-concurrency workloads.
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient, type Prisma } from '@prisma/client';

// ─── Logging config ───────────────────────────────────────────────────────────
// Development: every query + warnings so slow queries surface immediately.
// Production:  errors only — no query noise in structured logs.

const DEV_LOG: Prisma.LogLevel[]  = ['query', 'warn', 'error'];
const PROD_LOG: Prisma.LogLevel[] = ['error'];

// ─── Global cache type ────────────────────────────────────────────────────────
// Extending globalThis with a typed property avoids unsafe casts and keeps
// TypeScript strict mode satisfied.

type GlobalWithPrisma = typeof globalThis & {
  __prisma?: PrismaClient;
};

// ─── Singleton factory ────────────────────────────────────────────────────────

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? DEV_LOG : PROD_LOG,
    // 'pretty' in dev gives readable stack traces.
    // 'minimal' in production avoids leaking schema details in error strings.
    errorFormat: process.env.NODE_ENV === 'development' ? 'pretty' : 'minimal',
  });
}

// ─── Resolve singleton ────────────────────────────────────────────────────────
// 1. Check globalThis for a cached instance (survives hot-reload).
// 2. Create and cache in development. In production the module cache is
//    stable so attaching to globalThis is unnecessary.

const g = globalThis as GlobalWithPrisma;

const db: PrismaClient = g.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  g.__prisma = db;
}

export { db };
export default db;
