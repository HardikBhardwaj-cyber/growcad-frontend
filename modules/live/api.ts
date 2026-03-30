import { api } from "@/lib/api";

// ✅ TYPES
export type LiveClass = {
  id: string;
  title?: string;
  link: string;
};

export type LiveMeta = {
  active_classes: number;
  max_allowed: number;
};

export type LiveResponse = {
  data: LiveClass[];
  meta: LiveMeta;
};

// ✅ GET LIVE
export const getLive = async (): Promise<LiveResponse> => {
  const res = await api.get<LiveResponse>("/live");
  return res.data; // 🔥 REMOVE AXIOS WRAPPER
};

// ✅ CREATE LIVE
export const createLive = async () => {
  const res = await api.post("/live");
  return res.data;
};