"use client";

import { useScroll, useTransform } from "framer-motion";

export function useParallax(speed = 0.2) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => v * speed);
  return { y };
}