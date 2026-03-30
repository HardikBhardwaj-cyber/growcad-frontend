import { api } from "@/lib/api";

// ✅ TYPES
export type ReportData = {
  chart: {
    revenue: number;
  }[];
};

// ✅ API
export const getReports = async (): Promise<ReportData> => {
  const res = await api.get<ReportData>("/reports");
  return res.data; // 🔥 CRITICAL
};