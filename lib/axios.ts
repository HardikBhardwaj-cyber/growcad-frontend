// lib/axios.ts
// ─────────────────────────────────────────────────────────────────────────────
// Axios singleton — attaches auth token + tenant header to every request.
//
// baseURL strategy:
//   NEXT_PUBLIC_API_URL unset (default) → '/api'   same-origin Next.js routes
//   NEXT_PUBLIC_API_URL = 'https://api.growcad.in' → that URL directly
//     (do NOT add /api suffix — the external server's paths start at /)
//
// This means:
//   post('/auth/signup', ...)
//   → UNSET:  POST https://app.growcad.in/api/auth/signup  (App Router)
//   → SET:    POST https://api.growcad.in/auth/signup      (external API)
//
// The module API is identical in both cases — no call sites need to change
// when switching between internal and external API.
// ─────────────────────────────────────────────────────────────────────────────

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';

// env.apiUrl is '' (empty) for same-origin, or a full URL for external API
const BASE = env.apiUrl ? env.apiUrl : '/api';

export const api = axios.create({
  baseURL:         BASE,
  timeout:         20_000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor: token + tenant ──────────────────────────────────────

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window === 'undefined') return config;

  const token  = getCookie('gc_session');
  const tenant = window.gc_tenant;

  if (token)  config.headers.Authorization  = `Bearer ${token}`;
  if (tenant) config.headers['x-tenant-id'] = tenant;

  return config;
});

// ─── Response interceptor: 401 → login ───────────────────────────────────────

api.interceptors.response.use(
  res => res,
  (err: AxiosError) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      const next = encodeURIComponent(window.location.pathname);
      window.location.href = `/auth/login?next=${next}`;
    }
    return Promise.reject(err);
  },
);

// ─── Helper ───────────────────────────────────────────────────────────────────

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  return document.cookie
    .split('; ')
    .find(r => r.startsWith(`${name}=`))
    ?.split('=')[1];
}

export default api;
