// lib/api.ts — base request helpers used by all module apis
import api from './axios';
import type { ApiResponse, PaginatedResponse } from '@/types';

export async function get<T>(url: string, params?: object): Promise<T> {
  const res = await api.get<ApiResponse<T>>(url, { params });
  return res.data.data;
}

export async function post<T>(url: string, body?: object): Promise<T> {
  const res = await api.post<ApiResponse<T>>(url, body);
  return res.data.data;
}

export async function put<T>(url: string, body?: object): Promise<T> {
  const res = await api.put<ApiResponse<T>>(url, body);
  return res.data.data;
}

export async function del<T>(url: string): Promise<T> {
  const res = await api.delete<ApiResponse<T>>(url);
  return res.data.data;
}

export async function getPaginated<T>(url: string, params?: object): Promise<PaginatedResponse<T>> {
  const res = await api.get<ApiResponse<PaginatedResponse<T>>>(url, { params });
  return res.data.data;
}
