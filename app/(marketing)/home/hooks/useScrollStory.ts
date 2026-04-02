"use client";

import { useScroll, useTransform } from "framer-motion";

export function useScrollStory() {
  const { scrollYProgress } = useScroll();

  /* HERO → VALUE */
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.4]);

  /* VALUE APPEAR */
  const valueY = useTransform(scrollYProgress, [0.15, 0.35], [100, 0]);
  const valueOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);

  /* TRUST APPEAR */
  const trustY = useTransform(scrollYProgress, [0.3, 0.5], [100, 0]);
  const trustOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  /* FINAL CTA */
  const ctaScale = useTransform(scrollYProgress, [0.6, 0.9], [0.9, 1]);
  const ctaOpacity = useTransform(scrollYProgress, [0.6, 0.9], [0, 1]);

  return {
    heroScale,
    heroOpacity,
    valueY,
    valueOpacity,
    trustY,
    trustOpacity,
    ctaScale,
    ctaOpacity,
  };
}