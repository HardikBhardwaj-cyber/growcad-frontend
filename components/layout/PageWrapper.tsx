// components/layout/PageWrapper.tsx
'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { theme } from '@/styles/theme';

// ─────────────────────────────────────────────────────────────────────────────
// PageWrapper
//
// Inner wrapper for every dashboard page's content.
// Applied INSIDE AppShell's scrollable div — one level below the shell.
//
// Responsibilities:
//   1. Entry animation — fadeUp from lib/motion (opacity+y+blur on mount)
//   2. Consistent padding — p-6 everywhere, never per-page
//   3. Max-width guard — content never exceeds 1280px on ultra-wide screens
//   4. Overflow — y:auto is on the parent shell; this element doesn't scroll
//   5. Stagger support — exposes staggerContainer for child grid animations
//
// Usage:
//   // Basic — every page
//   <PageWrapper>...</PageWrapper>
//
//   // With staggered children (grid of cards)
//   <PageWrapper stagger>
//     <Card />  ← animate via fadeUp variants
//     <Card />
//   </PageWrapper>
//
//   // With custom max-width
//   <PageWrapper maxWidth="max-w-3xl">...</PageWrapper>
// ─────────────────────────────────────────────────────────────────────────────

interface PageWrapperProps {
  children:   ReactNode;
  /** Adds staggerContainer variant so direct children can use fadeUp */
  stagger?:   boolean;
  /** Tailwind max-w class — defaults to max-w-screen-xl (1280px) */
  maxWidth?:  string;
  className?: string;
}

export function PageWrapper({
  children,
  stagger    = false,
  maxWidth   = 'max-w-screen-xl',
  className,
}: PageWrapperProps) {
  // When stagger=true, the wrapper becomes the stagger orchestrator.
  // Children that use `variants={fadeUp}` + `initial/animate="hidden/visible"`
  // will cascade automatically via staggerContainer.
  const containerVariants = stagger
    ? staggerContainer(0.07, 0.06)  // stagger=0.07s between children, 0.06s initial delay
    : fadeUp;                        // simple fadeUp for non-staggered pages

  return (
    <motion.div
      className={cn(
        // Outer: full width, consistent padding
        'w-full p-6',
        // Override available via className
        className,
      )}
      style={{ zIndex: theme.zIndex.content }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Inner: max-width guard — keeps content readable on large screens */}
      <div className={cn('w-full', maxWidth, 'mx-auto')}>
        {children}
      </div>
    </motion.div>
  );
}

// ─── Re-export motion primitives for page-level use ──────────────────────────
// Pages import these instead of lib/motion directly to keep imports minimal.
export { fadeUp, staggerContainer } from '@/lib/motion';
