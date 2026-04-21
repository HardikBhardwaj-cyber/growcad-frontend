// modules/billing/components/UsageMeter.tsx
'use client';

import { motion } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';
import { theme } from '@/styles/theme';
import { cn } from '@/lib/utils';
import type { LimitState } from '../types';

// ─── Bar colour lookup ────────────────────────────────────────────────────────

const BAR_COLOR: Record<LimitState['status'], string> = {
  ok:       theme.gradients.brand,
  warning:  `linear-gradient(90deg, ${theme.colors.amber[400]}, #f97316)`,
  exceeded: `linear-gradient(90deg, ${theme.colors.rose[400]}, ${theme.colors.rose[500]})`,
};

const TEXT_COLOR: Record<LimitState['status'], string> = {
  ok:      'text-white/42',
  warning: 'text-amber-400',
  exceeded:'text-rose-400',
};

// ─── MB → readable string ──────────────────────────────────────────────────────

function formatStorage(mb: number): string {
  if (mb >= 1_024) return `${(mb / 1_024).toFixed(1)} GB`;
  return `${mb.toFixed(0)} MB`;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface UsageMeterProps {
  label:       string;
  state:       LimitState;
  unit?:       string;
  showContext?:boolean;
  /** Hides the label row — used when BillingPage renders its own header */
  bare?:       boolean;
}

export function UsageMeter({
  label, state, unit = 'messages', showContext = false, bare = false,
}: UsageMeterProps) {
  const { used, limit, pct, status } = state;
  const isBlocked  = limit === 0;
  const isMb       = unit === 'MB' || unit === 'GB';

  const fmt = (n: number) => isMb ? formatStorage(n) : n.toLocaleString();

  return (
    <div className="flex flex-col gap-1.5">
      {!bare && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12.5px] font-medium text-white/60">{label}</span>
          <span className={cn('shrink-0 text-[11.5px] font-semibold tabular-nums', TEXT_COLOR[status])}>
            {isBlocked
              ? (state.label ?? 'Not on your plan')
              : `${fmt(used)} / ${fmt(limit)}`}
          </span>
        </div>
      )}

      {/* Track */}
      <div className="relative h-[5px] w-full overflow-hidden rounded-full bg-white/[0.06]">
        {isBlocked ? (
          // Striped = "not available on this plan"
          <div className="absolute inset-0" style={{
            background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 4px, transparent 4px, transparent 8px)',
          }} />
        ) : (
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ background: BAR_COLOR[status] }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
          />
        )}
      </div>

      {/* Context label — "based on N students" */}
      {showContext && state.label && !isBlocked && (
        <p className="text-[10.5px] text-white/24">{state.label}</p>
      )}

      {/* Microcopy — benefit-driven, human */}
      {status === 'warning' && !isBlocked && (
        <p className="text-[11px] text-amber-400/80">
          {100 - pct}% remaining — you are getting close to your limit.
        </p>
      )}
      {status === 'exceeded' && !isBlocked && (
        <p className="text-[11px] text-rose-400/80">
          You have reached your limit. Upgrade to keep going.
        </p>
      )}
    </div>
  );
}
