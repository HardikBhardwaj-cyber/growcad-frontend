// server/middleware/auth.ts
// ─────────────────────────────────────────────────────────────────────────────
// Route-level auth middleware for Next.js API routes.
//
// Usage:
//   import { withAuth, withRole } from '@/server/middleware/auth';
//
//   export const GET = withAuth(async (req, ctx) => {
//     const { user } = ctx;   // typed, never null
//     return ok(data);
//   });
//
//   export const POST = withRole(['admin', 'superadmin'], handler);
//
// Token extraction order:
//   1. Authorization: Bearer <token>  (app.growcad.in frontend)
//   2. Cookie: gc_session=<token>     (cross-domain requests)
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, type TokenPayload } from '@/server/lib/jwt';
import { unauthorized, forbidden } from '@/server/lib/response';
import db from '@/server/lib/db';

// ─── Augmented context ────────────────────────────────────────────────────────

export interface AuthContext {
  user: {
    id:       string;
    tenantId: string | null;
    role:     TokenPayload['role'];
    sessionId:string;
  };
  tenantId: string | null;   // convenience alias
}

type Handler = (
  req:  NextRequest,
  ctx:  AuthContext,
) => Promise<NextResponse> | NextResponse;

type RouteHandler = (
  req:     NextRequest,
  params?: { params?: Record<string, string> },
) => Promise<NextResponse>;

// ─── Extract token from request ───────────────────────────────────────────────

function extractToken(req: NextRequest): string | null {
  // 1. Bearer header
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7);

  // 2. gc_session cookie
  const cookie = req.cookies.get('gc_session')?.value;
  if (cookie) return cookie;

  return null;
}

// ─── withAuth ─────────────────────────────────────────────────────────────────

export function withAuth(handler: Handler): RouteHandler {
  return async (req) => {
    const token = extractToken(req);
    if (!token) return unauthorized('No session token');

    let payload: TokenPayload;
    try {
      payload = verifyToken(token);
    } catch {
      return unauthorized('Session expired. Please sign in again.');
    }

    const ctx: AuthContext = {
      user: {
        id:        payload.userId,
        tenantId:  payload.tenantId,
        role:      payload.role,
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

// ─── withRole ─────────────────────────────────────────────────────────────────

export function withRole(
  roles: TokenPayload['role'][],
  handler: Handler,
): RouteHandler {
  return withAuth(async (req, ctx) => {
    if (!roles.includes(ctx.user.role)) {
      return forbidden(`Requires one of: ${roles.join(', ')}`);
    }
    return handler(req, ctx);
  });
}

// ─── withTenant ───────────────────────────────────────────────────────────────
// Validates that the request has a valid tenantId (non-superadmin routes).

export function withTenant(handler: Handler): RouteHandler {
  return withAuth(async (req, ctx) => {
    if (!ctx.tenantId) {
      return forbidden('Tenant context required');
    }
    return handler(req, ctx);
  });
}

// ─── Tenant isolation helper ─────────────────────────────────────────────────
// Use this in every query to enforce row-level tenant isolation.

export function tenantFilter(tenantId: string) {
  return { tenantId };
}
