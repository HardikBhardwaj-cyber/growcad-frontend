import { Variants } from "framer-motion";

/* ================= EASING (FIXED TYPES) ================= */

export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeInOutExpo = [0.87, 0, 0.13, 1] as const;

/* ================= FADE UP ================= */

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    filter: "blur(8px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: easeOutExpo,
    },
  },
};

/* ================= STAGGER ================= */

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

/* ================= SCALE IN ================= */

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    filter: "blur(6px)",
  },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: easeOutExpo,
    },
  },
};

/* ================= SLIDE RIGHT ================= */

export const slideRight: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
    filter: "blur(6px)",
  },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: easeOutExpo,
    },
  },
};

/* ================= SLIDE LEFT ================= */

export const slideLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
    filter: "blur(6px)",
  },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: easeOutExpo,
    },
  },
};

/* ================= BLUR IN ================= */

export const blurIn: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(14px)",
    scale: 0.98,
  },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 1,
      ease: easeOutExpo,
    },
  },
};

/* ================= FLOAT ================= */

export const float: Variants = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/* ================= GLOW ================= */

export const glowPulse: Variants = {
  animate: {
    opacity: [0.6, 1, 0.6],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/* ================= HERO TITLE ================= */

export const heroTitle: Variants = {
  hidden: {
    opacity: 0,
    y: 80,
    filter: "blur(12px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: easeOutExpo,
    },
  },
};

/* ================= BUTTON ================= */

export const buttonHover = {
  scale: 1.05,
  boxShadow: "0px 0px 30px rgba(124,58,237,0.6)",
};

export const buttonTap = {
  scale: 0.96,
};