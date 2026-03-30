"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/modules/dashboard/api";
import DashboardSkeleton from "@/components/shared/DashboardSkeleton";
import { ErrorState } from "@/components/shared/State";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { motion } from "framer-motion";

// ✅ TYPE
type DashboardStats = {
  total_students: number;
  revenue: number;
  pending: number;
  attendance: number;
};

// 🔥 Lazy load Card
const Card = dynamic(() => import("@/components/ui/card"));

export default function DashboardPage() {
  useAuthGuard();

  const online = useOnlineStatus();

  const { data, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  // ❌ Offline
  if (!online) {
    return (
      <div className="p-6 text-center text-yellow-400">
        No internet connection
      </div>
    );
  }

  // ⏳ Loading
  if (isLoading) return <DashboardSkeleton />;

  // ❌ Error
  if (error) return <ErrorState />;

  // ✅ SAFE DATA (FIXED)
  const stats: DashboardStats = data || {
    total_students: 0,
    revenue: 0,
    pending: 0,
    attendance: 0,
  };

  // 🔥 Cards
  const cards = [
    { label: "Students", value: stats.total_students },
    { label: "Revenue", value: `₹${stats.revenue}` },
    { label: "Pending", value: `₹${stats.pending}` },
    { label: "Attendance", value: `${stats.attendance}%` },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
    >
      {cards.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card>
            <p className="text-sm text-gray-400">
              {item.label}
            </p>
            <p className="text-xl md:text-2xl font-semibold">
              {item.value || 0}
            </p>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}