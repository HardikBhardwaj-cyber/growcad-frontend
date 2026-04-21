// lib/axios.ts
// ─────────────────────────────────────────────────────────────────────────────
// Axios instance — attaches auth token + tenant header to every request.
// ─────────────────────────────────────────────────────────────────────────────

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';

// ✅ Extend Window type safely
declare global {
  interface Window {
    gc_tenant?: string;
  }
}

const BASE = env.apiUrl ? `${env.apiUrl}/api` : '/api';

export const api = axios.create({
  baseURL: BASE,
  timeout: 20_000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ Request interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window === 'undefined') return config;

  const token = getCookie('gc_session');
  const tenant = window.gc_tenant; // ✅ NO any

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (tenant) {
    config.headers['x-tenant-id'] = tenant;
  }

  return config;
});

// ✅ Global 401 handler
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      const next = encodeURIComponent(window.location.pathname);
      window.location.href = `/auth/login?next=${next}`;
    }
    return Promise.reject(err);
  }
);

// ✅ Cookie helper
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;

  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

export default api;