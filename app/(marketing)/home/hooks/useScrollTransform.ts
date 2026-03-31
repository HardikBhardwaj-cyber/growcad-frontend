"use client";

import { useScroll, useTransform } from "framer-motion";

export function useScrollTransform() {
  const { scrollYProgress } = useScroll();

  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.6]);

  return { scale, opacity };
}
