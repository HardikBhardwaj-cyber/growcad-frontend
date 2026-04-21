// modules/billing/components/UsageWidget.tsx
'use client';

import Link                   from 'next/link';
import { motion }             from 'framer-motion';
import { MessageSquare, Mail, MessageCircle, ArrowUpRight } from 'lucide-react';
import { Card }               from '@/components/ui/card';
import { Skeleton }           from '@/components/ui/skeleton';
import { T_REVEAL, T_STANDARD } from '@/lib/motion';
import { theme }              from '@/styles/theme';
import { cn }                 from '@/lib/utils';
import { useUsageSummary }    from '../hooks/useBilling';
import type { LimitState, UsageMetricKey } from '../types';
import { ROUTES }             from '@/config/routes';
import type { LucideIcon } from 'lucide-react';

// ─── Metric config ────────────────────────────────────────────────────────────

interface MetricConfig {
  key:   UsageMetricKey;
  label: string;
  Icon:  LucideIcon;
}

const METRICS: MetricConfig[] = [
  { key: 'sms',             label: 'SMS',       Icon: MessageSquare },
  { key: 'whatsappUtility', label: 'WhatsApp',  Icon: MessageCircle },
  { key: 'emails',          label: 'Email',     Icon: Mail          },
];

// ─── Status → design token maps ───────────────────────────────────────────────

const BAR_GRADIENT: Record<LimitState['status'], string> = {
  ok:       theme.gradients.brand,
  warning:  `linear-gradient(90deg, ${theme.colors.amber[400]}, #f97316)`,
  exceeded: `linear-gradient(90deg, ${theme.colors.rose[400]}, ${theme.colors.rose[500]})`,
};

const LABEL_CLASS: Record<LimitState['status'], string> = {
  ok:       'text-white/40',
  warning:  'text-amber-400',
  exceeded: 'text-rose-400',
};

const ICON_BG: Record<LimitState['status'], string> = {
  ok:       `${theme.colors.violet[500]}18`,
  warning:  `${theme.colors.amber[400]}18`,
  exceeded: `${theme.colors.rose[400]}18`,
};

const ICON_COLOR: Record<LimitState['status'], string> = {
  ok:       theme.colors.violet[400],
  warning:  theme.colors.amber[400],
  exceeded: theme.colors.rose[400],
};

// ─── Single metric row ────────────────────────────────────────────────────────

interface MetricRowProps {
  label:  string;
  Icon:   LucideIcon;
  state:  LimitState;
  index:  number;
}

function MetricRow({ label, Icon, state, index }: MetricRowProps) {
  const { used, limit, pct, status } = state;
  const isBlocked = limit === 0;

  return (
    <motion.div
      className="flex flex-col gap-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...T_STANDARD, delay: index * 0.06 }}
    >
      {/* Label row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Icon badge */}
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
            style={{ background: ICON_BG[status] }}
            aria-hidden="true"
          >
            <Icon
              size={12}
              style={{ color: ICON_COLOR[status] }}
            />
          </div>
          <span className="text-[12.5px] font-medium text-white/70">{label}</span>
        </div>

        {/* Count */}
        <span
          className={cn(
            'shrink-0 text-[11.5px] font-semibold tabular-nums',
            LABEL_CLASS[status],
          )}
        >
          {isBlocked
            ? 'Not on plan'
            : `${used.toLocaleString()} / ${limit.toLocaleString()}`}
        </span>
      </div>

      {/* Progress track */}
      <div
        className="relative h-[5px] w-full overflow-hidden rounded-full bg-white/[0.06]"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} usage: ${pct}%`}
      >
        {isBlocked ? (
          /* Striped bar = feature not on plan */
          <div
            className="absolute inset-0"
            style={{
              background:
                'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 4px, transparent 4px, transparent 8px)',
            }}
          />
        ) : (
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ background: BAR_GRADIENT[status] }}
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min(pct, 100)}%` }}
            transition={{ ...T_REVEAL, delay: 0.1 + index * 0.06 }}
          />
        )}
      </div>

      {/* Status copy */}
      {status === 'warning' && !isBlocked && (
        <p className="text-[11px] text-amber-400/80">
          {100 - pct}% remaining — approaching your limit.
        </p>
      )}
      {status === 'exceeded' && !isBlocked && (
        <p className="text-[11px] text-rose-400/80">
          Limit reached. Upgrade to continue sending.
        </p>
      )}
    </motion.div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function UsageWidgetSkeleton() {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-lg" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-[5px] w-full rounded-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function UsageWidget() {
  const { summary, isLoading } = useUsageSummary();

  if (isLoading) return <UsageWidgetSkeleton />;
  if (!summary)  return null;

  const hasWarning = METRICS.some(
    ({ key }) => summary[key].status !== 'ok',
  );

  return (
    <Card className="p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-white">Usage</h3>
        <Link
          href={ROUTES.billing as string}
          className="flex items-center gap-0.5 text-[12px] text-violet-400 transition-colors hover:text-violet-300"
        >
          View all
          <ArrowUpRight size={11} />
        </Link>
      </div>

      {/* Metrics */}
      <div className="flex flex-col gap-4">
        {METRICS.map(({ key, label, Icon }, index) => (
          <MetricRow
            key={key}
            label={label}
            Icon={Icon}
            state={summary[key]}
            index={index}
          />
        ))}
      </div>

      {/* Upgrade nudge — only when at least one limit is warning/exceeded */}
      {hasWarning && (
        <motion.div
          className="mt-4 rounded-xl border border-amber-400/15 bg-amber-400/[0.06] px-3.5 py-2.5"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={T_STANDARD}
        >
          <p className="text-[11.5px] text-amber-400/90">
            You are approaching one or more usage limits.{' '}
            <Link
              href={ROUTES.billing as string}
              className="font-semibold underline decoration-amber-400/50 underline-offset-2 hover:decoration-amber-400 transition-colors"
            >
              Upgrade your plan
            </Link>{' '}
            to increase them.
          </p>
        </motion.div>
      )}
    </Card>
  );
}
