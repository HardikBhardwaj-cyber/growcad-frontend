// lib/motion.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for all animation values in the app.
//
// RULES (enforced by linting):
//   1. No component may inline ease arrays — import EASE_OUT / EASE_IN / EASE_SOFT
//   2. No component may inline duration numbers — use DUR_* constants
//   3. No component may define spring configs — use SPRING_* exports
//   4. lib/motion.ts itself may use literals (it IS the source of truth)
// ─────────────────────────────────────────────────────────────────────────────

import { theme } from '@/styles/theme';

// ─── Easing exports ───────────────────────────────────────────────────────────
// Named by semantic role — never by value.

export const EASE_OUT  = [0.16, 1, 0.3, 1]  as const;  // primary entry
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;  // gentle entry / hover
export const EASE_IN   = [0.4,  0, 1,   1]  as const;  // exits only
export const EASE_BACK = [0.34, 1.56, 0.64, 1] as const; // spring-back / confirmations

// ─── Duration exports ─────────────────────────────────────────────────────────
// Pulled from theme.duration so everything stays in sync.

export const DUR_MICRO    = theme.duration.micro;     // 0.18 — press, focus ring
export const DUR_STANDARD = theme.duration.standard;  // 0.28 — hover, state change
export const DUR_REVEAL   = theme.duration.reveal;    // 0.48 — content entry
export const DUR_EXIT     = 0.20;                     // exits — slightly faster than entry

// ─── Spring configs ───────────────────────────────────────────────────────────

export const SPRING_SNAPPY = { type: 'spring', stiffness: 500, damping: 30, mass: 0.6 } as const;
export const SPRING_SOFT   = { type: 'spring', stiffness: 280, damping: 26, mass: 0.8 } as const;
export const SPRING_BACK   = { type: 'spring', stiffness: 400, damping: 20, mass: 0.5 } as const;

// ─── Inline animation transitions (reusable objects) ─────────────────────────
// Use these in `transition={}` props instead of writing the object inline.

export const T_MICRO    = { duration: DUR_MICRO,    ease: EASE_OUT  } as const;
export const T_STANDARD = { duration: DUR_STANDARD, ease: EASE_SOFT } as const;
export const T_REVEAL   = { duration: DUR_REVEAL,   ease: EASE_OUT  } as const;
export const T_EXIT     = { duration: DUR_EXIT,     ease: EASE_IN   } as const;

/** Height collapse (AnimatePresence slide): fast in, instant-ish out */
export const T_COLLAPSE = { duration: DUR_MICRO,    ease: EASE_OUT  } as const;

// ─── Variant definitions ──────────────────────────────────────────────────────

/** Primary page/section entry: opacity + y + blur */
export const fadeUp = {
  hidden:  { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: T_REVEAL },
};

/** Lightweight row/item entry: opacity + y, no blur */
export const floatUp = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0,  transition: T_STANDARD },
};

/** Pure opacity — overlays, tooltips */
export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: T_STANDARD },
};

/** Fast presence fade with micro-scale — dropdowns, toasts */
export const presenceFade = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1,    transition: T_MICRO },
  exit:    { opacity: 0, scale: 0.97, transition: T_EXIT  },
};

/** Scale in from 94% — modal panels, popovers */
export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1,    transition: { duration: DUR_REVEAL, ease: EASE_OUT } },
};

/** Slide right — sidebar items */
export const slideRight = {
  hidden:  { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0,   transition: { duration: DUR_REVEAL, ease: EASE_OUT } },
};

/**
 * Stagger parent — wrap a list, children animate via their own variants.
 * @param stagger  delay between children (default 0.08s)
 * @param delay    initial delay before first child (default 0.1s)
 */
export const staggerContainer = (stagger = 0.08, delay = 0.1) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});
