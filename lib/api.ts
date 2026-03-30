import { apiClient } from "./axios";

// ✅ GENERIC API WRAPPER (FINAL CLEAN VERSION)
export const api = {
  get: <T = unknown>(
    url: string,
    params?: Record<string, unknown>
  ) => apiClient.get<T>(url, { params }),

  post: <T = unknown, B = unknown>(
    url: string,
    data?: B
  ) => apiClient.post<T>(url, data),

  put: <T = unknown, B = unknown>(
    url: string,
    data?: B
  ) => apiClient.put<T>(url, data),

  delete: <T = unknown>(url: string) =>
    apiClient.delete<T>(url),
};