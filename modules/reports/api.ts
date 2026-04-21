import { get } from "@/lib/api";

// ✅ TYPES
export type ReportData = {
  chart: {
    revenue: number;
  }[];
};

// ✅ API
export const getReports = async (): Promise<ReportData> => {
  return await get<ReportData>("/reports");
};