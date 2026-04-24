// middleware.ts
// ─────────────────────────────────────────────────────────────────────────────
// Next.js Edge Middleware — runs before every request on Vercel's Edge Runtime.
//
// CRITICAL: Edge Runtime cannot use Node.js native modules (bcrypt, crypto
// built-ins that need Node context, etc.). All JWT verification here uses the
// Web Crypto API via jose — NOT jsonwebtoken or bcrypt.
//
// Architecture:
//   growcad.in         → landing site; logged-in users redirected to dashboard
//   app.growcad.in     → app; unauthenticated users redirected to login
//   *.growcad.in       → tenant-specific; tenant slug injected as request header
//   localhost:3000     → treated as app (dev mode)
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, type JWTPayload }from 'jose';

// ─── Config ───────────────────────────────────────────────────────────────────

const SESSION_COOKIE = 'gc_session';
const APP_URL        = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.growcad.in';
const JWT_SECRET     = process.env.JWT_SECRET          ?? '';

const PUBLIC_AUTH_PATHS = new Set([
  '/auth/login',
  '/auth/signup',
  '/auth/otp',
  '/auth/onboarding',
]);

// ─── Edge-safe JWT verification (jose, no Node.js crypto) ────────────────────

interface SessionPayload extends JWTPayload {
  userId:   string;
  tenantId: string | null;
  role:     string;
}

async function verifySession(token: string): Promise<SessionPayload | null> {
  if (!JWT_SECRET) return null;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname, hostname } = req.nextUrl;

  // Pass through: static assets, Next.js internals, API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')   ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isApp = hostname.startsWith('app.') || hostname === 'localhost';
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  // ── Landing site (growcad.in) ─────────────────────────────────────────────
  if (!isApp) {
    if (token && pathname === '/') {
      const payload = await verifySession(token);
      if (payload) {
        return NextResponse.redirect(`${APP_URL}/dashboard`);
      }
    }
    return NextResponse.next();
  }

  // ── App (app.growcad.in) ──────────────────────────────────────────────────
  const isPublic = PUBLIC_AUTH_PATHS.has(pathname);

  if (!token) {
    if (isPublic) return NextResponse.next();
    const next = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/auth/login?next=${next}`, req.url));
  }

  const payload = await verifySession(token);

  if (!payload) {
    // Token invalid or expired — clear cookie and redirect to login
    const res = NextResponse.redirect(new URL('/auth/login', req.url));
    res.cookies.delete(SESSION_COOKIE);
    return res;
  }

  // Inject tenant context as headers so API routes can read without re-verifying
  const res = NextResponse.next();
  res.headers.set('x-user-id',   payload.userId);
  res.headers.set('x-user-role', payload.role);
  if (payload.tenantId) {
    res.headers.set('x-tenant-id', payload.tenantId);
  }

  // Superadmin guard
  if (pathname.startsWith('/admin') && payload.role !== 'superadmin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
