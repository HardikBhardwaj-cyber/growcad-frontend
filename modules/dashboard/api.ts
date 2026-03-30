import { api } from "@/lib/api";

// ✅ TYPE
export type DashboardStats = {
  total_students: number;
  revenue: number;
  pending: number;
  attendance: number;
};

// ✅ RESPONSE WRAPPER (IMPORTANT)
type DashboardResponse = {
  data: DashboardStats;
};

// ✅ API CALL (FULLY TYPED)
export const getDashboard = async (): Promise<DashboardStats> => {
  const res = await api.get<DashboardResponse>("/dashboard");

  return res.data.data; // ✅ NOW TYPESAFE
};