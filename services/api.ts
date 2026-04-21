// services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

/* ─────────────────────────────────────────────────────────────
   REQUEST INTERCEPTOR (SSR SAFE)
───────────────────────────────────────────────────────────── */

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window === "undefined") return config;

  try {
    const headers = config.headers ?? {};

    // Tenant
    const subdomain = window.location.hostname.split(".")[0];
    headers["X-Tenant-ID"] = subdomain;

    // Token
    const token = window.localStorage?.getItem("access_token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    config.headers = headers;
  } catch {
    // silent fail (never break request)
  }

  return config;
});

/* ─────────────────────────────────────────────────────────────
   RESPONSE INTERCEPTOR (SSR SAFE)
───────────────────────────────────────────────────────────── */

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    if (err.response?.status === 401) {
      if (typeof window !== "undefined") {
        const { logout } = await import("./auth.service");
        logout();
      }
    }

    return Promise.reject(err);
  }
);

export default api;