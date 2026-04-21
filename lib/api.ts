import api from './axios';
import type { ApiResponse, PaginatedResponse } from '@/types';

// GET
export async function get<T>(url: string, params?: object): Promise<T> {
  const res = await api.get<ApiResponse<T>>(url, { params });
  return res.data.data;
}

// POST
export async function post<T>(url: string, body?: object): Promise<T> {
  const res = await api.post<ApiResponse<T>>(url, body);
  return res.data.data;
}

// PUT
export async function put<T>(url: string, body?: object): Promise<T> {
  const res = await api.put<ApiResponse<T>>(url, body);
  return res.data.data;
}

// DELETE
export async function del<T>(url: string): Promise<T> {
  const res = await api.delete<ApiResponse<T>>(url);
  return res.data.data;
}

// PAGINATED
export async function getPaginated<T>(
  url: string,
  params?: object
): Promise<PaginatedResponse<T>> {
  const res = await api.get<ApiResponse<PaginatedResponse<T>>>(url, { params });
  return res.data.data;
}