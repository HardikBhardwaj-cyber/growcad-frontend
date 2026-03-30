"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "@/modules/superadmin/api";
import Card from "@/components/ui/card";

type AdminStats = {
  tenants: number;
  revenue: number;
  active_users: number;
  growth: number;
};

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery<AdminStats>({
    queryKey: ["adminStats"],
    queryFn: getAdminStats,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading stats</p>;

  // ✅ FIXED
  const stats: AdminStats = data || {
    tenants: 0,
    revenue: 0,
    active_users: 0,
    growth: 0,
  };

  return (
    <div className="grid md:grid-cols-4 gap-6">
      <Card>
        <h3>Total Tenants</h3>
        <p className="text-2xl">{stats.tenants}</p>
      </Card>

      <Card>
        <h3>Revenue</h3>
        <p className="text-2xl">₹{stats.revenue}</p>
      </Card>

      <Card>
        <h3>Active Users</h3>
        <p className="text-2xl">{stats.active_users}</p>
      </Card>

      <Card>
        <h3>Growth</h3>
        <p className="text-2xl">{stats.growth}%</p>
      </Card>
    </div>
  );
}