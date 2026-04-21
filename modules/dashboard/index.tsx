// modules/dashboard/index.tsx
// modules/dashboard/index.tsx

// ✅ DEFAULT PAGE EXPORT (FIX)
export { default } from "@/app/(dashboard)/dashboard/page";

// existing exports
export { Stats } from './components/Stats';
export { RevenueChart } from './components/RevenueChart';
export { ActivityFeed } from './components/ActivityFeed';

export {
  useDashboardStats,
  useRevenueChart,
  useRecentAdmissions
} from './hooks/useDashboard';

export { getDashboard } from './api';