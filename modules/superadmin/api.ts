import { api } from "@/lib/api";

// ✅ TYPE
export type AdminStats = {
  tenants: number;
  revenue: number;
  active_users: number;
  growth: number;
};

// ✅ RESPONSE TYPE (if backend wraps)
type AdminResponse = {
  data: AdminStats;
};

// ✅ API FUNCTION (FIXED)
export const getAdminStats = async (): Promise<AdminStats> => {
  const res = await api.get<AdminResponse>("/admin/stats");

  return res.data.data; // 🔥 unwrap properly
};