// lib/motion.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for all animation values in the app.
// ─────────────────────────────────────────────────────────────────────────────

import { theme } from '@/styles/theme';

// ─── Easing exports ───────────────────────────────────────────────────────────

export const EASE_OUT  = [0.16, 1, 0.3, 1]  as const;
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN   = [0.4,  0, 1,   1]  as const;
export const EASE_BACK = [0.34, 1.56, 0.64, 1] as const;

// ─── Duration exports ─────────────────────────────────────────────────────────

export const DUR_MICRO    = theme.duration.micro;
export const DUR_STANDARD = theme.duration.standard;
export const DUR_REVEAL   = theme.duration.reveal;
export const DUR_EXIT     = 0.20;

// ─── Spring configs ───────────────────────────────────────────────────────────

export const SPRING_SNAPPY = { type: 'spring', stiffness: 500, damping: 30, mass: 0.6 } as const;
export const SPRING_SOFT   = { type: 'spring', stiffness: 280, damping: 26, mass: 0.8 } as const;
export const SPRING_BACK   = { type: 'spring', stiffness: 400, damping: 20, mass: 0.5 } as const;

// ─── Transition presets ───────────────────────────────────────────────────────

export const T_MICRO    = { duration: DUR_MICRO,    ease: EASE_OUT  } as const;
export const T_STANDARD = { duration: DUR_STANDARD, ease: EASE_SOFT } as const;
export const T_REVEAL   = { duration: DUR_REVEAL,   ease: EASE_OUT  } as const;
export const T_EXIT     = { duration: DUR_EXIT,     ease: EASE_IN   } as const;

export const T_COLLAPSE = { duration: DUR_MICRO, ease: EASE_OUT } as const;

// ─── Variants ─────────────────────────────────────────────────────────────────

/** Primary page/section entry: opacity + y + blur */
export const fadeUp = {
  hidden:  { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: T_REVEAL },
};

/** Lightweight row/item entry */
export const floatUp = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0,  transition: T_STANDARD },
};

/** Pure opacity */
export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: T_STANDARD },
};

/** Presence fade (dropdowns, toasts) */
export const presenceFade = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1,    transition: T_MICRO },
  exit:    { opacity: 0, scale: 0.97, transition: T_EXIT  },
};

/** Modal / popover scale */
export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1,    transition: T_REVEAL },
};

/** Slide from left (sidebar items) */
export const slideRight = {
  hidden:  { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0,   transition: T_REVEAL },
};

/** 🔥 NEW — Strong upward entry (hero / auth / sections) */
export const slideUp = {
  hidden: {
    opacity: 0,
    y: 56,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: T_REVEAL,
  },
};

// ─── Stagger container ────────────────────────────────────────────────────────

export const staggerContainer = (stagger = 0.08, delay = 0.1) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});