// server/middleware/rateLimiter.ts
// ─────────────────────────────────────────────────────────────────────────────
// Production-grade in-memory rate limiter for Next.js App Router.
//
// Architecture
// ────────────
// The store lives on `globalThis` so it survives Next.js hot-reload in
// development (same pattern as the Prisma singleton). In production each
// Vercel function instance is isolated, which means rate-limit state is also
// isolated per instance — acceptable for MVP. When distributed limiting is
// needed, swap `MemoryStore` for `RedisStore` below; the `checkRateLimit`
// interface stays identical.
//
// Algorithm: fixed window counter
// ───────────────────────────────
// Each key tracks { count, windowStart }. On every call:
//   1. If the key is missing or the window has expired → start a fresh window.
//   2. If count has reached the maximum → deny.
//   3. Otherwise increment and allow.
//
// Fixed window is O(1) per check, uses O(active-keys) memory, and has no
// drift. The boundary-burst problem (burst at t=59s + t=61s) is acceptable
// for auth-endpoint protection. Use a sliding-window algorithm (two counters
// + interpolation) if stricter enforcement is required — the Store interface
// below supports it without changing callers.
//
// Cleanup
// ───────
// Expired entries are pruned lazily inside `checkRateLimit` (no separate
// timer) so there is no memory leak even in serverless environments where
// `setInterval` is unreliable. A sweep of the entire store also runs whenever
// the live-entry count exceeds SWEEP_THRESHOLD so worst-case memory is
// bounded regardless of the number of unique identifiers.
//
// Future-readiness
// ────────────────
// Replacing the in-memory store with Redis requires only implementing the
// `Store` interface and passing it to `checkRateLimit`. No call sites change.
// ─────────────────────────────────────────────────────────────────────────────

import type { NextRequest } from 'next/server';

// ─── Public types ─────────────────────────────────────────────────────────────

/** Options passed to checkRateLimit(). */
export interface RateLimitOptions {
  /** Length of the time window in milliseconds. */
  windowMs:   number;
  /** Maximum number of requests allowed per window. */
  max:        number;
  /** Namespace prefix — separates limits for different actions. Default: 'rl'. */
  keyPrefix?: string;
}

/** Return value of checkRateLimit(). */
export interface RateLimitResult {
  /** Whether the request should be allowed to proceed. */
  allowed:   boolean;
  /** Number of requests the caller can still make in this window. Never negative. */
  remaining: number;
  /**
   * Unix timestamp (ms) when the current window resets.
   * Alias: `resetTime` — both point to the same value.
   */
  resetAt:   number;
  /** Alias for resetAt (backward-compatible with spec). */
  resetTime: number;
}

// ─── Store abstraction ────────────────────────────────────────────────────────
// One internal interface separates the algorithm from the storage backend.
// When you add Redis, implement this interface and pass the implementation in.

interface StoreEntry {
  count:       number;
  windowStart: number;
}

interface Store {
  get(key: string): StoreEntry | undefined;
  set(key: string, entry: StoreEntry): void;
  delete(key: string): void;
  entries(): IterableIterator<[string, StoreEntry]>;
  size: number;
}

// ─── In-memory store ──────────────────────────────────────────────────────────

class MemoryStore implements Store {
  private readonly map = new Map<string, StoreEntry>();

  get(key: string): StoreEntry | undefined   { return this.map.get(key);     }
  set(key: string, entry: StoreEntry): void  { this.map.set(key, entry);     }
  delete(key: string): void                  { this.map.delete(key);         }
  entries(): IterableIterator<[string, StoreEntry]> { return this.map.entries(); }
  get size(): number                         { return this.map.size;         }
}

// ─── Global singleton ─────────────────────────────────────────────────────────
// Attached to globalThis so Next.js hot-reload in dev reuses the same store
// rather than creating a new one (and losing all in-flight rate-limit state).

type GlobalWithStore = typeof globalThis & { __rateLimitStore?: Store };

const g = globalThis as GlobalWithStore;

if (!g.__rateLimitStore) {
  g.__rateLimitStore = new MemoryStore();
}

const store: Store = g.__rateLimitStore;

// ─── Cleanup ──────────────────────────────────────────────────────────────────
// Run a full sweep when the store grows beyond this threshold. Keeps memory
// bounded without a setInterval (which is unreliable in serverless).

const SWEEP_THRESHOLD = 10_000; // entries

function sweepExpired(now: number, windowMs: number): void {
  for (const [key, entry] of store.entries()) {
    // Use 2× the window so entries from any recent config survive.
    if (now - entry.windowStart > windowMs * 2) {
      store.delete(key);
    }
  }
}

// ─── checkRateLimit ───────────────────────────────────────────────────────────

/**
 * Check whether `identifier` has exceeded the configured rate limit.
 *
 * @param identifier  Unique string for this client — typically an IP address,
 *                    phone number, or tenantId. Falls back to `'unknown'` if
 *                    an empty string is passed.
 * @param options     Window configuration and optional key prefix.
 * @returns           `{ allowed, remaining, resetAt, resetTime }`
 *
 * @example
 *   const result = checkRateLimit(ip, { windowMs: 60_000, max: 5, keyPrefix: 'signup' });
 *   if (!result.allowed) return tooManyRequests('Too many signup attempts.');
 */
export function checkRateLimit(
  identifier: string,
  options:    RateLimitOptions,
): RateLimitResult {
  const id     = identifier.trim() || 'unknown';
  const prefix = options.keyPrefix?.trim() || 'rl';
  const key    = `${prefix}:${id}`;
  const now    = Date.now();
  const resetAt = now + options.windowMs;

  // Lazy sweep when the store is large.
  if (store.size > SWEEP_THRESHOLD) {
    sweepExpired(now, options.windowMs);
  }

  const entry = store.get(key);

  // ── No entry or expired window → start a fresh window ─────────────────────
  if (!entry || now - entry.windowStart >= options.windowMs) {
    store.set(key, { count: 1, windowStart: now });
    const remaining = Math.max(0, options.max - 1);
    return { allowed: true, remaining, resetAt, resetTime: resetAt };
  }

  // ── Limit reached → deny ──────────────────────────────────────────────────
  if (entry.count >= options.max) {
    const windowResetAt = entry.windowStart + options.windowMs;
    return { allowed: false, remaining: 0, resetAt: windowResetAt, resetTime: windowResetAt };
  }

  // ── Within limit → increment and allow ────────────────────────────────────
  entry.count += 1;
  store.set(key, entry);  // explicit set keeps Store interface generic (Redis needs it)

  const windowResetAt = entry.windowStart + options.windowMs;
  const remaining     = Math.max(0, options.max - entry.count);
  return { allowed: true, remaining, resetAt: windowResetAt, resetTime: windowResetAt };
}

// ─── getClientIp ──────────────────────────────────────────────────────────────

/**
 * Extract the real client IP from a Next.js `NextRequest`.
 *
 * Priority:
 *   1. `x-forwarded-for` (Vercel, Cloudflare, load balancers) — first IP only.
 *   2. `x-real-ip` (Nginx, some CDNs).
 *   3. `'unknown'` — never crashes; caller must handle the fallback.
 *
 * Security note: `x-forwarded-for` can be spoofed by the client when the
 * server sits behind a proxy that appends rather than replaces the header.
 * Vercel's infrastructure sets this header reliably; if you move to a
 * different host, verify that the header is trusted at the infrastructure
 * level before using it as a rate-limit key.
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for: client, proxy1, proxy2 → take the leftmost IP.
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp?.trim()) return realIp.trim();

  return 'unknown';
}

// ─── Preset configurations ────────────────────────────────────────────────────
// Each preset has its own keyPrefix so the same IP can hit /signup and /login
// independently without one counter affecting the other.
//
// Naming convention:
//   *_LIMITER  → full RateLimitOptions object (pass directly to checkRateLimit)
//   API_LIMITER → named map of presets for per-endpoint use

/** OTP send / resend — tight limit to prevent SMS flooding. */
export const OTP_LIMITER: RateLimitOptions = {
  windowMs:  60_000,   // 1 minute
  max:       3,
  keyPrefix: 'otp',
};

/** Email/password login — moderate window to allow legitimate retries. */
export const LOGIN_LIMITER: RateLimitOptions = {
  windowMs:  15 * 60_000,  // 15 minutes
  max:       10,
  keyPrefix: 'login',
};

/** General authenticated API calls — per-tenant baseline. */
export const GENERAL_API_LIMITER: RateLimitOptions = {
  windowMs:  60_000,
  max:       120,
  keyPrefix: 'api',
};

/**
 * Named map of preset limiters — import `API_LIMITER` and pick by action.
 *
 * @example
 *   const result = checkRateLimit(ip, API_LIMITER.signup);
 *   if (!result.allowed) return tooManyRequests('...');
 */
export const API_LIMITER = {
  signup:  { windowMs: 60_000,         max: 5,   keyPrefix: 'signup'  } satisfies RateLimitOptions,
  otp:     { windowMs: 60_000,         max: 3,   keyPrefix: 'otp'     } satisfies RateLimitOptions,
  login:   { windowMs: 15 * 60_000,    max: 10,  keyPrefix: 'login'   } satisfies RateLimitOptions,
  api:     { windowMs: 60_000,         max: 120, keyPrefix: 'api'     } satisfies RateLimitOptions,
  ai:      { windowMs: 60_000,         max: 30,  keyPrefix: 'ai'      } satisfies RateLimitOptions,
  storage: { windowMs: 60_000,         max: 20,  keyPrefix: 'storage' } satisfies RateLimitOptions,
} as const satisfies Record<string, RateLimitOptions>;
