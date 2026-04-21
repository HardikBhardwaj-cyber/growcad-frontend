// modules/dashboard/components/RevenueChart.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card }     from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fadeUp, EASE_OUT } from '@/lib/motion';
import { theme }    from '@/styles/theme';
import { useRevenueChart } from '../hooks/useDashboard';
import { formatCurrency }  from '@/lib/utils';
import type { RevenuePoint } from '../hooks/useDashboard';

// ─────────────────────────────────────────────────────────────────────────────

const CHART_H = 160; // px — bar chart height

interface TooltipData { month: string; amount: number; target: number; x: number; }

// ─── Empty state ──────────────────────────────────────────────────────────────

function ChartEmpty() {
  return (
    <div className="flex h-[160px] items-center justify-center">
      <p className="text-[12.5px] text-white/28">No data for this period</p>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-[160px] w-full rounded-xl" />
      <div className="mt-2 flex gap-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-2 flex-1 rounded" />
        ))}
      </div>
    </Card>
  );
}

// ─── Bar chart with tooltip ───────────────────────────────────────────────────

function BarChart({ data }: { data: RevenuePoint[] }) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const maxVal = Math.max(...data.map(d => Math.max(d.amount, d.target)), 1);

  return (
    <div className="relative">
      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            className="pointer-events-none absolute z-10 min-w-[140px] rounded-xl border p-3 text-left"
            style={{
              left:        Math.min(tooltip.x, 80) + '%',
              bottom:      '105%',
              transform:   'translateX(-50%)',
              background:  theme.colors.bgFloat,
              border:      `1px solid ${theme.colors.borderMid}`,
              boxShadow:   theme.shadows.dashCard,
            }}
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1    }}
            exit={{   opacity: 0, y: 4, scale: 0.96  }}
            transition={{ duration: 0.14, ease: EASE_OUT }}
          >
            {/* Top-edge light */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-xl"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
            />
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/36">
              {tooltip.month}
            </p>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] text-white/36">Revenue</p>
                <p className="text-[13px] font-bold text-white">{formatCurrency(tooltip.amount)}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/36">Target</p>
                <p className="text-[13px] font-semibold text-violet-400">{formatCurrency(tooltip.target)}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bar + target grid */}
      <div className="relative flex items-end gap-1" style={{ height: CHART_H }}>
        {/* Target line */}
        {data.length > 0 && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 border-t border-dashed border-violet-500/20"
            style={{
              bottom: `${(data.reduce((s, d) => s + d.target, 0) / data.length / maxVal) * 100}%`,
            }}
          />
        )}

        {data.map((d, i) => {
          const pct    = (d.amount / maxVal) * 100;
          const isLast = i >= data.length - 3;

          return (
            <div
              key={d.month}
              className="group relative flex flex-1 cursor-default flex-col justify-end"
              style={{ height: '100%' }}
              onMouseEnter={() =>
                setTooltip({
                  month:  d.month,
                  amount: d.amount,
                  target: d.target,
                  x:      (i / (data.length - 1)) * 100,
                })
              }
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Bar */}
              <motion.div
                className="w-full rounded-t-[3px] transition-opacity"
                style={{
                  background: isLast
                    ? theme.gradients.brand
                    : `${theme.colors.violet[600]}28`,
                  height: `${pct}%`,
                }}
                initial={{ scaleY: 0, originY: '100%' }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.48, delay: i * 0.028, ease: EASE_OUT }}
              />

              {/* Hover brightening overlay */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-t-[3px] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                style={{ background: `${theme.colors.violet[500]}18` }}
              />
            </div>
          );
        })}
      </div>

      {/* Month labels */}
      <div className="mt-2 flex gap-1">
        {data.map(d => (
          <div
            key={d.month}
            className="flex-1 text-center text-[9px] text-white/24"
          >
            {d.month}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5">
        <div
          className="h-2 w-4 rounded-full"
          style={{ background: theme.gradients.brand }}
          aria-hidden
        />
        <span className="text-[11px] text-white/40">Revenue</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div
          className="h-px w-4 border-t border-dashed"
          style={{ borderColor: theme.colors.violet[500] + '60' }}
          aria-hidden
        />
        <span className="text-[11px] text-white/40">Target</span>
      </div>
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export function RevenueChart() {
  const { data = [], isLoading } = useRevenueChart();

  if (isLoading) return <ChartSkeleton />;

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible">
      <Card className="p-5">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-[14px] font-semibold tracking-[-0.02em] text-white">
            Revenue
          </h3>
          <div className="flex items-center gap-4">
            <Legend />
            <span className="text-[11px] text-white/28">Last 12 months</span>
          </div>
        </div>

        {data.length === 0 ? <ChartEmpty /> : <BarChart data={data} />}
      </Card>
    </motion.div>
  );
}
