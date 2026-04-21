// proxy.ts (IMPORTANT: rename file)

import { NextRequest, NextResponse } from 'next/server';
import { tryVerifyToken } from '@/server/lib/jwt';

const SESSION_COOKIE = 'gc_session';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.growcad.in';

const PUBLIC_AUTH_PATHS = new Set([
  '/auth/login',
  '/auth/signup',
  '/auth/otp',
  '/auth/onboarding',
]);

export async function proxy(req: NextRequest): Promise<NextResponse> {
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

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const payload = token ? await tryVerifyToken(token) : null;

  // 🌐 LANDING SITE
  if (!isApp) {
    if (payload && pathname === '/') {
      return NextResponse.redirect(`${APP_URL}/dashboard`);
    }
    return NextResponse.next();
  }

  // 🔐 PUBLIC ROUTES
  if (PUBLIC_AUTH_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  // 🔐 AUTH GUARD
  if (!payload) {
    const login = new URL('/auth/login', req.url);
    login.searchParams.set('next', pathname);
    return NextResponse.redirect(login);
  }

  // 🛡️ SUPERADMIN GUARD
  if (pathname.startsWith('/admin') && payload.role !== 'superadmin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 🔗 Forward headers
  const headers = new Headers(req.headers);
  if (payload.tenantId) headers.set('x-tenant-id', payload.tenantId);
  headers.set('x-user-id', payload.userId);
  headers.set('x-user-role', payload.role);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};