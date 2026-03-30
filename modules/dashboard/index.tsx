"use client";

import Stats from "./components/Stats";
import RevenueChart from "./components/RevenueChart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Stats />
      <RevenueChart />
    </div>
  );
}