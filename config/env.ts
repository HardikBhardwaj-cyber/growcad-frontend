

// config/env.ts
// ─────────────────────────────────────────────────────────────────────────────
// Environment configuration — single source of truth for all env vars.
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │ DEPLOYMENT MODES                                                        │
// ├─────────────────────────────────────────────────────────────────────────┤
// │ Mode A — Full Next.js (default, recommended)                            │
// │   API routes live in /app/api/* (App Router)                            │
// │   NEXT_PUBLIC_API_URL = (leave unset or set to empty string)            │
// │   Axios baseURL → /api  (same-origin, no network hop)                   │
// │   Database → Supabase via DATABASE_URL in server env vars               │
// ├─────────────────────────────────────────────────────────────────────────┤
// │ Mode B — External API (FastAPI on Railway, or any other server)         │
// │   NEXT_PUBLIC_API_URL = https://api.growcad.in                          │
// │   Axios baseURL → https://api.growcad.in  (direct, no /api suffix)      │
// │   External server must handle CORS for app.growcad.in                   │
// └─────────────────────────────────────────────────────────────────────────┘
//
// IMPORTANT: Do NOT set NEXT_PUBLIC_API_URL to a URL that includes /api —
// the axios client adds path segments like /auth/signup on top of this base.
// Correct: 'https://api.growcad.in'
// Wrong:   'https://api.growcad.in/api'  ← results in /api/auth/signup → 404
// ─────────────────────────────────────────────────────────────────────────────

export const env = {
  /**
   * External API base URL.
   * Leave unset (or '') to use Next.js App Router API routes at /api/*.
   * Set to a full origin (no trailing slash) to call an external backend.
   * @example '' | 'https://api.growcad.in'
   */
  apiUrl:  process.env.NEXT_PUBLIC_API_URL  ?? '',

  /** Full URL of the app subdomain */
  appUrl:  process.env.NEXT_PUBLIC_APP_URL  ?? 'https://app.growcad.in',

  /** Full URL of the marketing landing site */
  landUrl: process.env.NEXT_PUBLIC_LAND_URL ?? 'https://growcad.in',

  isDev:   process.env.NODE_ENV === 'development',
  isProd:  process.env.NODE_ENV === 'production',
} as const;

