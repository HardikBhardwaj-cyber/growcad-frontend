import { Variants, Easing } from "framer-motion";

/* ---------------- EASING ---------------- */

// Premium cubic-bezier (Apple / Stripe feel)
export const easeOut: Easing = [0.16, 1, 0.3, 1];

/* ---------------- FADE UP ---------------- */

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeOut,
    },
  },
};

/* ---------------- FADE IN ---------------- */

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};

/* ---------------- SCALE IN ---------------- */

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: easeOut,
    },
  },
};

/* ---------------- STAGGER CONTAINER ---------------- */

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

/* ---------------- FLOATING (LOOP ANIMATION) ---------------- */

export const floating: Variants = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/* ---------------- BUTTON INTERACTIONS ---------------- */

export const buttonHover: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: easeOut,
    },
  },
  tap: {
    scale: 0.96,
  },
};