// modules/dashboard/hooks/useDashboard.ts

import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

// ✅ TYPE
export type RecentAdmission = {
  name: string;
  course: string;
  time: string;
  status: "Enrolled" | "Pending";
};



export type RevenuePoint = {
  month: string;
  amount: number;
  target: number;
};

type DashboardResponse = {
  stats: DashStats;
  revenue: RevenuePoint[];
  recentAdmissions: RecentAdmission[];
};

// ✅ MAIN HOOK
export const useDashboard = () => {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get("/dashboard");
      return res.data;
    },
  });
};

// ✅ REQUIRED (FIXES YOUR ERROR)
export const useRecentAdmissions = () => {
  const { data, isLoading } = useDashboard();

  return {
    data: data?.recentAdmissions ?? [],
    isLoading,
  };
};

export const useRevenueChart = () => {
  const { data, isLoading } = useDashboard();

  return {
    data: data?.revenue ?? [],
    isLoading,
  };
};

export type DashStats = {
  totalStudents: number;
  studentDelta: number;

  feesCollected: number;
  feesDelta: number;

  newAdmissions: number;
  admissionDelta: number;

  pendingDues: number;
  pendingDelta: number;
};


export const useDashboardStats = () => {
  const { data, isLoading, isError, refetch } = useDashboard();

  return {
    data: data?.stats ?? null, // ✅ SAFE
    isLoading,
    isError,
    refetch,
  };
};