// server/middleware/auth.ts
// ✅ Next.js 16 + Turbopack + Edge-safe

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, type TokenPayload } from '@/server/lib/jwt';
import { unauthorized, forbidden } from '@/server/lib/response';

// ─── Context ────────────────────────────────────────────────────────────────

export interface AuthContext {
  user: {
    id: string;
    tenantId: string | null;
    role: TokenPayload['role'];
    sessionId: string;
  };
  tenantId: string | null;
}

// ─── Types (FIXED for Next.js 16) ───────────────────────────────────────────

type Handler = (
  req: NextRequest,
  ctx: AuthContext
) => Promise<NextResponse>;

type RouteHandler = (
  req: NextRequest,
  context: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>;

// ─── Token extraction ───────────────────────────────────────────────────────

function extractToken(req: NextRequest): string | null {
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7);

  const cookie = req.cookies.get('gc_session')?.value;
  if (cookie) return cookie;

  return null;
}

// ─── withAuth ───────────────────────────────────────────────────────────────

export function withAuth(handler: Handler): RouteHandler {
  return async (req, _context) => {
    const token = extractToken(req);
    if (!token) return unauthorized('No session token');

    let payload: TokenPayload;

    try {
      payload = await verifyToken(token); // ✅ async (JOSE)
    } catch {
      return unauthorized('Session expired. Please sign in again.');
    }

    const ctx: AuthContext = {
      user: {
        id: payload.userId,
        tenantId: payload.tenantId,
        role: payload.role,
        sessionId: payload.sessionId,
      },
      tenantId: payload.tenantId,
    };

    try {
      return await handler(req, ctx);
    } catch (err) {
      console.error('[withAuth handler error]', err);
      const { serverError } = await import('@/server/lib/response');
      return serverError(err);
    }
  };
}

// ─── withRole ───────────────────────────────────────────────────────────────

export function withRole(
  roles: TokenPayload['role'][],
  handler: Handler
): RouteHandler {
  return withAuth(async (req, ctx) => {
    if (!roles.includes(ctx.user.role)) {
      return forbidden(`Requires one of: ${roles.join(', ')}`);
    }
    return handler(req, ctx);
  });
}

// ─── withTenant ─────────────────────────────────────────────────────────────

export function withTenant(handler: Handler): RouteHandler {
  return withAuth(async (req, ctx) => {
    if (!ctx.tenantId) {
      return forbidden('Tenant context required');
    }
    return handler(req, ctx);
  });
}

// ─── Tenant filter helper ───────────────────────────────────────────────────

export function tenantFilter(tenantId: string) {
  return { tenantId };
}