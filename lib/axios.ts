import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// 🔥 REQUEST INTERCEPTOR
apiClient.interceptors.request.use((config) => {
  // Token
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Tenant (safe)
    const host = window.location.host;
    const subdomain = host.split(".")[0];

    if (subdomain && subdomain !== "www" && subdomain !== "growcad") {
      config.headers["X-Tenant-ID"] = subdomain;
    }
  }

  return config;
});