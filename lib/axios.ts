// lib/axios.ts
// ─────────────────────────────────────────────────────────────────────────────
// Axios instance — SSR safe, Edge safe, Vercel safe
// ─────────────────────────────────────────────────────────────────────────────

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/* ─────────────────────────────────────────────────────────────
   BASE URL (SAFE FOR SSR + CLIENT)
───────────────────────────────────────────────────────────── */

const BASE =
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : '/api';

/* ─────────────────────────────────────────────────────────────
   GLOBAL WINDOW TYPE
───────────────────────────────────────────────────────────── */

declare global {
  interface Window {
    gc_tenant?: string;
  }
}

/* ─────────────────────────────────────────────────────────────
   AXIOS INSTANCE
───────────────────────────────────────────────────────────── */

export const api = axios.create({
  baseURL: BASE,
  timeout: 20_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ─────────────────────────────────────────────────────────────
   SAFE COOKIE READER
───────────────────────────────────────────────────────────── */

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));

  if (!match) return undefined;

  return decodeURIComponent(match.split('=')[1]);
}

/* ─────────────────────────────────────────────────────────────
   REQUEST INTERCEPTOR
───────────────────────────────────────────────────────────── */

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // 🚫 NEVER run browser logic on server
  if (typeof window === 'undefined') return config;

  const token = getCookie('gc_session');
  const tenant = window.gc_tenant;

  // ✅ Safe header mutation
  config.headers = config.headers ?? {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (tenant) {
    config.headers['x-tenant-id'] = tenant;
  }

  return config;
});

/* ─────────────────────────────────────────────────────────────
   RESPONSE INTERCEPTOR
───────────────────────────────────────────────────────────── */

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const next = encodeURIComponent(window.location.pathname);
        window.location.href = `/auth/login?next=${next}`;
      }
    }

    return Promise.reject(err);
  }
);

export default api;