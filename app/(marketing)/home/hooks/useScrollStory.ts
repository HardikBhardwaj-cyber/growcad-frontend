"use client";

import {
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
import type { UseScrollOptions } from "framer-motion";
import { RefObject } from "react";

/* ================= TYPES ================= */

type ScrollOffset = NonNullable<UseScrollOptions["offset"]>;

type ScrollStory = {
  progress: MotionValue<number>;

  y: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;

  blur: MotionValue<number>;
};

/* ================= HOOK ================= */

export function useScrollStory(
  ref: RefObject<HTMLElement>,
  offset: ScrollOffset = ["start end", "end start"]
): ScrollStory {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  const progress = scrollYProgress;

  const y = useTransform(progress, [0, 1], [80, -80]);

  const opacity = useTransform(
    progress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  const scale = useTransform(progress, [0, 1], [0.96, 1]);

  const blur = useTransform(progress, [0, 1], [10, 0]);

  return {
    progress,
    y,
    opacity,
    scale,
    blur,
  };
}