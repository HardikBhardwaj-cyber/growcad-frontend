// components/shared/State.tsx
'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, scaleIn, EASE_OUT } from '@/lib/motion';
import { theme } from '@/styles/theme';
import { cn } from '@/lib/utils';

// ─── EmptyState ───────────────────────────────────────────────────────────────
//
// Phase 5 upgrade:
//   - motion entry: icon scales in (scaleIn) + text fades up (fadeUp), staggered
//   - Icon container pulses softly on mount to draw attention without distraction
//   - Consistent with Card and Stats entry animations
//

interface EmptyStateProps {
  icon?:      ReactNode;
  title:      string;
  subtitle?:  string;
  action?:    ReactNode;
  className?: string;
  /** Minimum height of the container. Defaults to 260px */
  minHeight?: number;
}

export function EmptyState({
  icon,
  title,
  subtitle,
  action,
  className,
  minHeight = 260,
}: EmptyStateProps) {
  const DUR_MICRO    = theme.duration.micro;
  const DUR_STANDARD = theme.duration.standard;

  return (
    <motion.div
      className={cn(
        'flex flex-col items-center justify-center gap-4 text-center',
        className,
      )}
      style={{ minHeight }}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      {/* Icon — scale in with spring-back overshoot */}
      {icon && (
        <motion.div
          className="flex items-center justify-center rounded-2xl border"
          style={{
            width:      56,
            height:     56,
            background: theme.colors.surface,
            border:     `1px solid ${theme.colors.border}`,
          }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1   }}
          transition={{
            duration: DUR_STANDARD,
            delay:    0.1,
            ease:     theme.ease.back as [number,number,number,number],
          }}
          aria-hidden
        >
          {icon}
        </motion.div>
      )}

      {/* Copy */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR_STANDARD, delay: 0.18, ease: EASE_OUT }}
      >
        <h3 className="text-[14px] font-semibold text-white/70">{title}</h3>
        {subtitle && (
          <p className="mt-[6px] text-[12.5px] text-white/36">{subtitle}</p>
        )}
      </motion.div>

      {/* Action — enters last */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR_STANDARD, delay: 0.26, ease: EASE_OUT }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── LoadingSpinner ───────────────────────────────────────────────────────────
// A simple circular spinner using CSS border-trick.
// Uses theme violet color. No Framer Motion — GPU composited via CSS.

interface LoadingSpinnerProps {
  size?:      number;
  className?: string;
}

export function LoadingSpinner({ size = 20, className = '' }: LoadingSpinnerProps) {
  return (
    <div
      className={cn('animate-spin rounded-full', className)}
      style={{
        width:       size,
        height:      size,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'rgba(255,255,255,0.08)',
        borderTopColor: theme.colors.violet[500],
      }}
      role="status"
      aria-label="Loading"
    />
  );
}

// ─── InlineStatus ─────────────────────────────────────────────────────────────
// Compact status row used inside cards and table cells.
// Replaces ad-hoc status text patterns throughout the app.

type StatusVariant = 'success' | 'error' | 'warning' | 'info' | 'loading';

const STATUS_STYLES: Record<StatusVariant, { dot: string; text: string }> = {
  success: { dot: theme.colors.emerald[400], text: 'text-emerald-400' },
  error:   { dot: theme.colors.rose[400],    text: 'text-rose-400'    },
  warning: { dot: theme.colors.amber[400],   text: 'text-amber-400'   },
  info:    { dot: theme.colors.violet[400],  text: 'text-violet-400'  },
  loading: { dot: theme.colors.violet[400],  text: 'text-white/40'    },
};

interface InlineStatusProps {
  variant:  StatusVariant;
  label:    string;
  pulse?:   boolean;
}

export function InlineStatus({ variant, label, pulse = false }: InlineStatusProps) {
  const { dot, text } = STATUS_STYLES[variant];
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {pulse && (
          <span
            className="animate-ping-slow absolute h-full w-full rounded-full opacity-60"
            style={{ background: dot }}
            aria-hidden
          />
        )}
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: dot }}
          aria-hidden
        />
      </span>
      <span className={cn('text-[11.5px] font-medium', text)}>{label}</span>
    </div>
  );
}
