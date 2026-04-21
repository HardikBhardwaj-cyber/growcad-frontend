'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Building2, IndianRupee, Clock, TrendingUp, AlertCircle } from 'lucide-react';

import { Card }     from '@/components/ui/card';
import { Badge }    from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/skeleton';

import { superadminApi } from '@/modules/superadmin/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { fadeUp, staggerContainer } from '@/lib/motion';

// ✅ TYPE FIX (VERY IMPORTANT)
type AdminStats = {
  totalTenants: number;
  activeSubs: number;
  totalStudents: number;
  totalRevenueRupees: number;
  pendingCashApprovals: number;
  recentSignups: {
    id: string;
    name: string;
    createdAt: string;
    plan: string;
  }[];
};

type ExpiringItem = {
  tenant: {
    id: string;
    name: string;
  };
  subscription: {
    planId: string;
  };
  daysLeft: number;
};

export default function SuperadminDashboard() {

  const { data, isLoading } = useQuery<AdminStats>({
    queryKey: ['admin', 'stats'],
    queryFn: superadminApi.stats,
    refetchInterval: 60_000,
  });

  const { data: expiring = [] } = useQuery<ExpiringItem[]>({
    queryKey: ['admin', 'billing', 'expiring'],
    queryFn: () => superadminApi.billing.expiring(7),
  });

  const STATS = [
    {
      label: 'Total institutes',
      value: data?.totalTenants ?? 0,
      Icon: Building2,
      color: '#8b5cf6',
      fmt: (v: number) => String(v),
    },
    {
      label: 'Active subscriptions',
      value: data?.activeSubs ?? 0,
      Icon: TrendingUp,
      color: '#10b981',
      fmt: (v: number) => String(v),
    },
    {
      label: 'Total students',
      value: data?.totalStudents ?? 0,
      Icon: Users,
      color: '#60a5fa',
      fmt: (v: number) => String(v),
    },
    {
      label: 'Total revenue',
      value: data?.totalRevenueRupees ?? 0,
      Icon: IndianRupee,
      color: '#f59e0b',
      fmt: (v: number) => formatCurrency(v),
    },
  ];

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-[22px] font-bold tracking-[-0.03em] text-white">
          Superadmin dashboard
        </h1>
        <p className="mt-1 text-[13.5px] text-white/40">
          Platform-wide overview — all institutes
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer(0.06, 0.04)}
        initial="hidden"
        animate="visible"
      >
        {STATS.map(({ label, value, Icon, color, fmt }) => (
          <motion.div key={label} variants={fadeUp}>
            <Card className="p-5">
              {isLoading ? (
                <>
                  <Skeleton className="mb-3 h-3 w-32" />
                  <Skeleton className="h-7 w-24" />
                </>
              ) : (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[12.5px] text-white/42">{label}</span>
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-xl"
                      style={{ background: `${color}18`, color }}
                    >
                      <Icon size={15} />
                    </div>
                  </div>

                  <p className="text-[24px] font-bold tracking-[-0.03em] text-white">
                    {fmt(value)}
                  </p>
                </>
              )}
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Pending + Expiring */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Pending Cash */}
        {(data?.pendingCashApprovals ?? 0) > 0 && (
          <Card className="p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <AlertCircle size={16} className="text-amber-400" />
              <h3 className="text-[14px] font-semibold text-white">
                {data?.pendingCashApprovals} pending cash approval{data?.pendingCashApprovals !== 1 ? 's' : ''}
              </h3>
            </div>

            <p className="text-[13px] text-white/42 mb-3">
              Institutes waiting for manual plan activation.
            </p>

            <a
              href="/admin/tenants?filter=pending"
              className="text-[13px] text-violet-400 hover:text-violet-300 transition-colors"
            >
              Review pending →
            </a>
          </Card>
        )}

        {/* Expiring */}
        {expiring.length > 0 && (
          <Card className="p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <Clock size={16} className="text-rose-400" />
              <h3 className="text-[14px] font-semibold text-white">
                Expiring in 7 days
              </h3>
            </div>

            <div className="space-y-2">
              {expiring.slice(0, 4).map((item) => (
                <div
                  key={item.tenant.id}
                  className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="text-[13px] font-medium text-white/80">
                      {item.tenant.name}
                    </p>
                    <p className="text-[11px] text-white/36">
                      {item.daysLeft} day{item.daysLeft !== 1 ? 's' : ''} left
                    </p>
                  </div>

                  <Badge
                    variant={item.daysLeft <= 2 ? 'danger' : 'warning'}
                    size="sm"
                    static
                  >
                    {item.subscription.planId}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Recent Signups */}
      {(data?.recentSignups ?? []).length > 0 && (
        <Card className="p-5">
          <h3 className="mb-4 text-[14px] font-semibold text-white">
            Recent signups
          </h3>

          <div className="space-y-1">
            {data!.recentSignups.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-white/3 transition-colors"
              >
                <div>
                  <p className="text-[13px] font-medium text-white/82">{t.name}</p>
                  <p className="text-[11px] text-white/36">
                    {formatDate(t.createdAt)}
                  </p>
                </div>

                <Badge variant="info" size="sm" static>
                  {t.plan}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}