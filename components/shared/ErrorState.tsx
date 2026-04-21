// components/shared/ErrorState.tsx
'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { fadeUp, EASE_OUT } from '@/lib/motion';
import { theme } from '@/styles/theme';

// ─────────────────────────────────────────────────────────────────────────────
// Phase 5 upgrade:
//   - motion entry: full container uses fadeUp
//   - icon container scales in with spring-back (same as EmptyState)
//   - error copy fades up 80ms after icon settles
//   - retry button appears last (delay 0.28)
//
// This matches EmptyState's animation sequence — one consistent pattern
// for "this section has no content to show."
// ─────────────────────────────────────────────────────────────────────────────

interface ErrorStateProps {
  title?:    string;
  message?:  string;
  onRetry?:  () => void;
  /** Minimum container height. Default 300px. */
  minHeight?: number;
}

export function ErrorState({
  title     = 'Something went wrong',
  message   = 'An unexpected error occurred. Please try again.',
  onRetry,
  minHeight = 300,
}: ErrorStateProps) {
  const DUR_STANDARD = theme.duration.standard;

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-4 text-center"
      style={{ minHeight }}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      {/* Icon — scale in with spring-back */}
      <motion.div
        className="flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          background: 'rgba(251,113,133,0.08)',
          border:     '1px solid rgba(251,113,133,0.18)',
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
        <AlertTriangle size={22} className="text-rose-400" />
      </motion.div>

      {/* Copy */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR_STANDARD, delay: 0.18, ease: EASE_OUT }}
      >
        <h3 className="text-[15px] font-semibold text-white">{title}</h3>
        <p className="mt-[6px] max-w-[32ch] text-[13px] text-white/40">{message}</p>
      </motion.div>

      {/* Retry — enters last */}
      {onRetry && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR_STANDARD, delay: 0.28, ease: EASE_OUT }}
        >
          <Button variant="secondary" size="sm" onClick={onRetry}>
            <RefreshCw size={13} />
            Try again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
