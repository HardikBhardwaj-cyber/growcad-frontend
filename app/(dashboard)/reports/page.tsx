"use client";

import { useQuery } from "@tanstack/react-query";
import { getReports } from "@/modules/reports/api";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";

// ✅ TYPE (OPTIONAL BUT CLEAN)
type ReportData = {
  chart: {
    revenue: number;
  }[];
};

export default function ReportsPage() {
  const plan = "academic";
  const access = useFeatureAccess(plan);

  // 🔥 ALWAYS CALL HOOK FIRST
  const { data, isLoading, error } = useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
  });

  // 🔥 FEATURE CHECK AFTER HOOK
  if (!access.reports) {
    return (
      <div className="p-6 text-yellow-400">
        Upgrade to access Reports
      </div>
    );
  }

  if (isLoading)
    return <p className="p-6 text-gray-400">Loading...</p>;

  if (error)
    return <p className="p-6 text-red-400">Error loading reports</p>;

  // ✅ FIX AXIOS STRUCTURE
  const r: ReportData = data ?? { chart: [] };

  return (
    <div className="p-4 md:p-6">

      <h2 className="mb-4 text-xl font-semibold">
        Reports
      </h2>

      {/* 🔥 CHART CARD */}
      <div className="p-4 rounded-xl border border-white/10 bg-white/5">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={r.chart}>
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#a855f7"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}