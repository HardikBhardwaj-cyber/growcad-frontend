"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

type StaggerOptions = {
  y?: number;
  x?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
};

export function useStagger(options: StaggerOptions = {}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 60,
      x = 0,
      duration = 0.8,
      stagger = 0.12,
      delay = 0,
    } = options;

    const items = el.children;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        {
          opacity: 0,
          y,
          x,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration,
          stagger,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [options]);

  return ref;
}