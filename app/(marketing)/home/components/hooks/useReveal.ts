"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type RevealOptions = {
  y?: number;
  x?: number;
  scale?: number;
  delay?: number;
  duration?: number;
  triggerStart?: string;
};

export function useReveal(options: RevealOptions = {}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 60,
      x = 0,
      scale = 1,
      delay = 0,
      duration = 1,
      triggerStart = "top 85%",
    } = options;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y,
          x,
          scale: scale < 1 ? scale : 1,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: triggerStart,
            once: true, // 🔥 important (no repeat flicker)
          },
        }
      );
    });

    return () => ctx.revert();
  }, [options]);

  return ref;
}