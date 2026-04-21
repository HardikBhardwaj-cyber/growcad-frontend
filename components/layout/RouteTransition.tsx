// components/layout/RouteTransition.tsx
'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { fadeUp, EASE_OUT } from '@/lib/motion';
import { theme } from '@/styles/theme';

// ─────────────────────────────────────────────────────────────────────────────
// RouteTransition
//
// Wraps page content to animate between route changes.
// Strategy: use pathname as AnimatePresence key — when pathname changes,
// the old page exits and the new page enters.
//
// Why not use Next.js layouts for this?
// Next.js App Router doesn't unmount shared layouts on route change — only
// the page.tsx content is swapped. RouteTransition lives INSIDE the layout's
// scrollable area (AppShell's main column), wrapping each page's children.
//
// Entry:  fadeUp (opacity 0→1, y 20→0, blur 6→0px), Out Expo, 480ms
// Exit:   fade out only (opacity 1→0), In easing, 160ms — fast exit
//         (exit should be faster than entry so users feel forward progress)
//
// Usage in app/(dashboard)/layout.tsx:
//   <RouteTransition>{children}</RouteTransition>
// ─────────────────────────────────────────────────────────────────────────────

// Exit is deliberately fast (160ms) — the new page enters much more slowly.
// This asymmetry creates forward momentum: the old screen "gets out of the way"
// quickly, then the new content arrives with presence.
const EXIT_DURATION = theme.duration.micro * 0.9; // ~160ms
const EASE_IN       = theme.ease.in as [number,number,number,number];

const pageVariants = {
  hidden: {
    opacity: 0,
    y:       20,
    filter:  'blur(6px)',
  },
  visible: {
    opacity: 1,
    y:       0,
    filter:  'blur(0px)',
    transition: {
      duration: theme.duration.reveal,   // 0.48s
      ease:     EASE_OUT,
    },
  },
  exit: {
    opacity: 0,
    y:       -8,          // exits slightly upward — reinforces forward direction
    filter:  'blur(2px)',
    transition: {
      duration: EXIT_DURATION,
      ease:     EASE_IN,  // accelerates away
    },
  },
};

interface RouteTransitionProps {
  children: ReactNode;
}

export function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{ zIndex: theme.zIndex.content }}
        // Prevent layout shift during transition by keeping height stable
        className="min-h-full w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
