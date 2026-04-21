import { get, post } from "@/lib/api";

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
  return await get<LiveResponse>("/live");
};

// ✅ CREATE LIVE
export const createLive = async () => {
  return await post("/live");
};