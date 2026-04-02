"use client";

import {
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";

type OffsetTuple = [
  "start end" | "start start" | "center end" | "end start",
  "end start" | "end end" | "center start" | "start end"
];

type Options = {
  offset?: OffsetTuple;
};

export function useScrollTransform(options?: Options) {
  /* ================= SCROLL ================= */

  const offset: OffsetTuple =
    options?.offset ?? ["start end", "end start"];

  const { scrollYProgress } = useScroll({
    offset,
  });

  /* ================= SMOOTH ================= */

  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
  });

  /* ================= TRANSFORMS ================= */

  const y: MotionValue<number> = useTransform(
    smooth,
    [0, 1],
    [80, -80]
  );

  const opacity: MotionValue<number> = useTransform(
    smooth,
    [0, 0.3, 1],
    [0, 1, 0.6]
  );

  const scale: MotionValue<number> = useTransform(
    smooth,
    [0, 1],
    [0.95, 1]
  );

  const blur: MotionValue<string> = useTransform(
    smooth,
    [0, 1],
    ["blur(10px)", "blur(0px)"]
  );

  return {
    progress: smooth,
    y,
    opacity,
    scale,
    blur,
  };
}