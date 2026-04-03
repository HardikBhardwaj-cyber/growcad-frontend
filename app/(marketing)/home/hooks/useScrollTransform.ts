"use client";

import {
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
  MotionValue,
} from "framer-motion";
import { RefObject } from "react";

/* ================= TYPES ================= */

type ScrollOffset =
  | ["start end", "end start"]
  | ["start start", "end end"]
  | ["center end", "center start"]
  | (string | number)[];

type Options = {
  target?: RefObject<HTMLElement>;
  offset?: ScrollOffset;

  intensity?: number;
  smooth?: boolean;

  /* 🔥 NEW: CONTROL RANGE */
  range?: [number, number];
};

/* ================= HOOK ================= */

export function useScrollTransform(options?: Options) {
  const {
    target,
    offset = ["start end", "end start"],
    intensity = 1,
    smooth = true,
    range = [0, 1],
  } = options || {};

  /* ================= SCROLL ================= */

  const { scrollYProgress } = useScroll({
    target,
    offset:
      offset as NonNullable<
        Parameters<typeof useScroll>[0]
      >["offset"],
  });

  /* ================= VELOCITY ================= */

  const velocity = useVelocity(scrollYProgress);

  /* ================= SPRING ================= */

  const spring = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    mass: 0.6,
  });

  const progress = smooth ? spring : scrollYProgress;

  /* ================= RANGE CONTROL ================= */

  const ranged = useTransform(progress, range, [0, 1]);

  /* ================= TRANSFORMS ================= */

  const y: MotionValue<number> = useTransform(
    ranged,
    [0, 1],
    [80 * intensity, -80 * intensity]
  );

  const x: MotionValue<number> = useTransform(
    ranged,
    [0, 1],
    [-40 * intensity, 40 * intensity]
  );

  const opacity: MotionValue<number> = useTransform(
    ranged,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0]
  );

  const scale: MotionValue<number> = useTransform(
    ranged,
    [0, 1],
    [0.96, 1]
  );

  /* 🔥 BETTER BLUR CURVE */
  const blurValue = useTransform(
    ranged,
    [0, 0.5, 1],
    [12, 4, 0]
  );

  const blur: MotionValue<string> = useTransform(
    blurValue,
    (b) => `blur(${b}px)`
  );

  /* 🔥 DEPTH ROTATION */
  const rotateX: MotionValue<number> = useTransform(
    ranged,
    [0, 1],
    [6 * intensity, -6 * intensity]
  );

  const rotateY: MotionValue<number> = useTransform(
    ranged,
    [0, 1],
    [-6 * intensity, 6 * intensity]
  );

  /* ================= RETURN ================= */

  return {
    progress: ranged,

    x,
    y,

    opacity,
    scale,

    blur,
    blurValue,

    rotateX,
    rotateY,

    velocity,
  };
}