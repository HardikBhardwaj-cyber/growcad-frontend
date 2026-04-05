'use client';

import { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

/**
 * Wraps the app with Framer Motion's MotionConfig.
 * When the user has prefers-reduced-motion enabled, all Framer Motion
 * animations are instantly completed (duration = 0.001s).
 * This does NOT affect CSS animations or GSAP — handle those separately
 * in SmoothScroll.tsx (already guarded) and useScrollStory.ts.
 */
export default function ReducedMotionConfig({ children }: { children: ReactNode }) {
  const shouldReduce = useReducedMotion();

  return (
    <MotionConfig
      reducedMotion="user"
      transition={
        shouldReduce
          ? { duration: 0.001 }
          : { ease: [0.22, 1, 0.36, 1], duration: 0.6 }
      }
    >
      {children}
    </MotionConfig>
  );
}
