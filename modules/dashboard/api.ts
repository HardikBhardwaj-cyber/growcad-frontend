import { get } from "@/lib/api";

// TYPE
export type DashboardStats = {
  total_students: number;
  revenue: number;
  pending: number;
  attendance: number;
};

// API CALL (clean + typesafe)
export const getDashboard = async (): Promise<DashboardStats> => {
  return await get<DashboardStats>("/dashboard");
};




