// modules/dashboard/components/Stats.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, IndianRupee, ClipboardList, TrendingDown } from 'lucide-react';
import { Card }     from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fadeUp, staggerContainer, EASE_OUT } from '@/lib/motion';
import { theme }    from '@/styles/theme';
import { useDashboardStats } from '../hooks/useDashboard';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { DashStats } from '../hooks/useDashboard';
import type { LucideIcon } from 'lucide-react';

// ─── Config — order determines stagger sequence ───────────────────────────────

type StatConfig = {
  key: keyof DashStats;
  deltaKey: keyof DashStats;
  label: string;
  Icon: LucideIcon;
  accent: string;
  fmt: (v: number) => string;
};

const CONFIGS: StatConfig[] = [
  {
    key: 'totalStudents',
    deltaKey: 'studentDelta',
    label: 'Total Students',
    Icon: Users,
    accent: theme.colors.violet[600],
    fmt: formatNumber,
  },
  {
    key: 'feesCollected',
    deltaKey: 'feesDelta',
    label: 'Fees Collected',
    Icon: IndianRupee,
    accent: theme.colors.emerald[500],
    fmt: formatCurrency,
  },
  {
    key: 'newAdmissions',
    deltaKey: 'admissionDelta',
    label: 'New Admissions',
    Icon: ClipboardList,
    accent: theme.colors.blue[600],
    fmt: formatNumber,
  },
  {
    key: 'pendingDues',
    deltaKey: 'pendingDelta',
    label: 'Pending Dues',
    Icon: TrendingDown,
    accent: theme.colors.rose[500],
    fmt: formatCurrency,
  },
];

// ─── countUp hook ─────────────────────────────────────────────────────────────
// Animates a number from 0 to target over ~900ms using requestAnimationFrame.
// Runs once per mount — does not re-trigger on data refetch.

function useCountUp(target: number, enabled: boolean): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const DURATION = 900;

  // ✅ derive instant value without effect
  const immediateValue = !enabled || target === 0;

  useEffect(() => {
    if (immediateValue) return; // ❌ no setState here

    startRef.current = null;

    const animate = (now: number) => {
      if (!startRef.current) startRef.current = now;

      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Math.round(eased * target)); // ✅ allowed (async RAF)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, immediateValue]);

  // ✅ return direct value instead of setting state
  if (immediateValue) return target;

  return value;
}

// ─── Single stat card ─────────────────────────────────────────────────────────

interface StatCardProps {
  label:    string;
  value:    number;
  delta:    number;
  Icon:     LucideIcon;
  accent:   string;
  fmt:      (v: number) => string;
  ready:    boolean;
}

function StatCard({ label, value, delta, Icon, accent, fmt, ready }: StatCardProps) {
  const animated = useCountUp(value, ready);
  const up = delta >= 0;

  return (
    <Card className="p-5 overflow-hidden">
      {/* Accent glow — top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full"
        style={{
          background: `radial-gradient(circle, ${accent}28 0%, transparent 70%)`,
          filter: 'blur(18px)',
        }}
      />

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[12px] font-medium text-white/40">{label}</span>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ background: `${accent}1a`, color: accent }}
          aria-hidden
        >
          <Icon size={15} />
        </div>
      </div>

      {/* Value — countUp */}
      <p className="mb-[6px] font-mono text-[24px] font-bold tracking-[-0.03em] text-white">
        {fmt(animated)}
      </p>

      {/* Delta */}
      <p className={`text-[11.5px] font-semibold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
        {up ? '↑' : '↓'} {Math.abs(delta)}%{' '}
        <span className="font-normal text-white/28">vs last month</span>
      </p>
    </Card>
  );
}

// ─── Skeleton grid — same grid as real cards: no layout shift ─────────────────

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.026] p-5"
          aria-hidden
        >
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-8 rounded-xl" />
          </div>
          <Skeleton className="mb-2 h-7 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

// ─── Empty/error state ────────────────────────────────────────────────────────

function StatsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {CONFIGS.map(cfg => (
        <div
          key={cfg.key}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.026] p-5 text-center"
        >
          <cfg.Icon size={18} className="text-white/20" aria-hidden />
          <p className="text-[11.5px] text-white/30">No data</p>
        </div>
      ))}
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export function Stats() {
  const { data, isLoading, isError, refetch } = useDashboardStats();

  if (isLoading) return <StatsSkeleton />;
  if (isError || !data) return <StatsError onRetry={refetch} />;

  return (
    <motion.div
      className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      variants={staggerContainer(0.07, 0.04)}
      initial="hidden"
      animate="visible"
    >
      {CONFIGS.map(({ key, deltaKey, label, Icon, accent, fmt }) => (
  <motion.div key={String(key)} variants={fadeUp}>
    <StatCard
      label={label}
      value={data?.[key] ?? 0}
      delta={data?.[deltaKey] ?? 0}
      Icon={Icon}
      accent={accent}
      fmt={fmt}
      ready={true}
    />
  </motion.div>
))}
          
    </motion.div>
  );
}
