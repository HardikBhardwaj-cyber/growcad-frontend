// middleware.ts
// ─────────────────────────────────────────────────────────────────────────────
// Next.js Edge Middleware — runs before every request.
// Routes requests based on subdomain:
//   growcad.in         → landing site logic (redirect to app if logged in)
//   app.growcad.in     → auth guard (redirect to login if no session)
//   localhost:3000     → treated as app (dev)
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { tryVerifyToken } from '@/server/lib/jwt';

const SESSION_COOKIE = 'gc_session';
const APP_URL        = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.growcad.in';

const PUBLIC_AUTH_PATHS = new Set([
  '/auth/login', '/auth/signup', '/auth/otp', '/auth/onboarding',
]);

export function middleware(req: NextRequest): NextResponse {
  const { pathname, hostname } = req.nextUrl;

  // Bypass static + API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isApp = hostname.startsWith('app.') || hostname === 'localhost';

  if (!isApp) {
    // Landing site: redirect logged-in users to dashboard
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (token && tryVerifyToken(token) && pathname === '/') {
      return NextResponse.redirect(`${APP_URL}/dashboard`);
    }
    return NextResponse.next();
  }

  // App site: enforce auth on non-public paths
  if (PUBLIC_AUTH_PATHS.has(pathname)) return NextResponse.next();

  const token   = req.cookies.get(SESSION_COOKIE)?.value;
  const payload = token ? tryVerifyToken(token) : null;

  if (!payload) {
    const login = new URL('/auth/login', req.url);
    login.searchParams.set('next', pathname);
    return NextResponse.redirect(login);
  }

  // Superadmin guard
  if (pathname.startsWith('/admin') && payload.role !== 'superadmin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Forward identity headers to API routes
  const headers = new Headers(req.headers);
  if (payload.tenantId) headers.set('x-tenant-id', payload.tenantId);
  headers.set('x-user-id',   payload.userId);
  headers.set('x-user-role', payload.role);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
