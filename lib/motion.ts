import { Variants } from "framer-motion";

// ================== TIMINGS ==================
export const durations = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
};

// ================== EASING ==================
export const ease = {
  smooth: [0.25, 0.1, 0.25, 1] as const,
  soft: [0.16, 1, 0.3, 1] as const,
};

// ================== FADE ==================
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: durations.normal,
      ease: ease.smooth,
    },
  },
};

// ================== SLIDE UP ==================
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: ease.soft,
    },
  },
};

// ================== SCALE ==================
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.fast,
      ease: ease.smooth,
    },
  },
};

// ================== STAGGER ==================
export const stagger: Variants = {
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};