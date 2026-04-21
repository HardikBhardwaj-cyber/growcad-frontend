// config/env.ts
// ─────────────────────────────────────────────────────────────────────────────
// Environment configuration for the Growcad app.
//
// NEXT_PUBLIC_API_URL:
//   - Production: '' (empty) → calls /api/* on the same Next.js origin
//     (app.growcad.in/api/auth/login, etc.)
//   - Development: '' (empty) → calls /api/* on localhost:3000
//   - External API override: set to full URL, e.g. https://api.growcad.in
//
// Why same-origin by default:
//   Next.js App Router API routes (/app/api/**) run in the same process.
//   Calling them via absolute URL adds an extra round-trip over the network.
//   Same-origin calls skip the network and go directly to the handler.
// ─────────────────────────────────────────────────────────────────────────────

export const env = {
  // Empty string = same-origin /api/* calls (Next.js App Router routes)
  apiUrl:  process.env.NEXT_PUBLIC_API_URL  ?? '',
  appUrl:  process.env.NEXT_PUBLIC_APP_URL  ?? 'https://app.growcad.in',
  landUrl: process.env.NEXT_PUBLIC_LAND_URL ?? 'https://growcad.in',
  isDev:   process.env.NODE_ENV === 'development',
  isProd:  process.env.NODE_ENV === 'production',
} as const;
