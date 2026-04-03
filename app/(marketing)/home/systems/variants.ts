import { Variants } from "framer-motion";

/* ================= CORE TIMING ================= */

export const duration = {
  fast: 0.4,
  base: 0.7,
  slow: 1,
};

export const ease = {
  expoOut: [0.16, 1, 0.3, 1] as const,
  expoInOut: [0.87, 0, 0.13, 1] as const,
};

/* ================= BASE MOTION ================= */

const baseEnter = {
  opacity: 0,
  y: 40,
};

const baseShow = {
  opacity: 1,
  y: 0,
};

/* ================= FADE UP ================= */

export const fadeUp: Variants = {
  hidden: baseEnter,
  show: {
    ...baseShow,
    transition: {
      duration: duration.base,
      ease: ease.expoOut,
    },
  },
};

/* ================= STAGGER ================= */

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

/* ================= SCALE IN ================= */

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.base,
      ease: ease.expoOut,
    },
  },
};

/* ================= SLIDES ================= */

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.base,
      ease: ease.expoOut,
    },
  },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.base,
      ease: ease.expoOut,
    },
  },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.base,
      ease: ease.expoOut,
    },
  },
};

/* ================= HERO (SPECIAL) ================= */

export const heroTitle: Variants = {
  hidden: {
    opacity: 0,
    y: 80,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: ease.expoOut,
    },
  },
};

/* ================= MICRO INTERACTIONS ================= */

export const hoverLift = {
  y: -4,
  scale: 1.02,
};

export const tapPress = {
  scale: 0.96,
};

/* ================= FLOAT ================= */

export const float: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/* ================= GLOW (CONTROLLED) ================= */

export const glowPulse: Variants = {
  animate: {
    opacity: [0.7, 1, 0.7],
    scale: [1, 1.03, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/* ================= CARD HOVER ================= */

export const cardHover = {
  scale: 1.03,
  y: -6,
  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
};

/* ================= BUTTON ================= */

export const buttonHover = {
  scale: 1.05,
};

export const buttonTap = {
  scale: 0.94,
};