// components/ui/Badge.tsx
// Phase 7.5: motion.span entry on mount (scaleIn + fade from above).

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SPRING_BACK } from '@/lib/motion';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BadgeProps {
  children:    ReactNode;
  variant?:    'default' | 'success' | 'warning' | 'danger' | 'info';
  size?:       'sm' | 'md';
  dot?:        boolean;
  className?:  string;
  /** Suppress entry animation — for badges inside tables/rows that stagger */
  static?:     boolean;
}

// ─── Variant styles ───────────────────────────────────────────────────────────

const VARIANTS = {
  default: 'bg-white/[0.06] border-white/[0.08] text-white/60',
  success: 'bg-emerald-500/12 border-emerald-500/25 text-emerald-400',
  warning: 'bg-amber-500/12  border-amber-500/25  text-amber-400',
  danger:  'bg-rose-500/12   border-rose-500/25   text-rose-400',
  info:    'bg-violet-500/12 border-violet-500/25  text-violet-400',
};

const DOT = {
  default: 'bg-white/40',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger:  'bg-rose-400',
  info:    'bg-violet-400',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Badge({
  children,
  variant  = 'default',
  size     = 'sm',
  dot      = false,
  className,
  static:  isStatic = false,
}: BadgeProps) {
  const cls = cn(
    'inline-flex items-center gap-1.5 rounded-full border font-medium',
    size === 'sm' ? 'px-2 py-0.5 text-[10.5px]' : 'px-2.5 py-1 text-[12px]',
    VARIANTS[variant],
    className,
  );

  const inner = (
    <>
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', DOT[variant])} />
      )}
      {children}
    </>
  );

  if (isStatic) {
    return <span className={cls}>{inner}</span>;
  }

  // Animated: spring-back scale + short fade — reads as "confirmed status"
  return (
    <motion.span
      className={cls}
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1   }}
      transition={SPRING_BACK}
    >
      {inner}
    </motion.span>
  );
}
