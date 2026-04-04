"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type RevealOptions = {
  y?: number;
  x?: number;
  scale?: number;
  delay?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  triggerStart?: string;
  once?: boolean;
  scrub?: boolean;
};

export function useReveal(options: RevealOptions = {}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 🔥 destructure once (prevents re-trigger spam)
    const {
      y = 60,
      x = 0,
      scale = 1,
      delay = 0,
      duration = 0.9,
      stagger = 0,
      ease = "power3.out",
      triggerStart = "top 85%",
      once = true,
      scrub = false,
    } = options;

    const ctx = gsap.context(() => {
      const targets = el.children.length > 0 ? el.children : el;

      gsap.fromTo(
        targets,
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
          ease,
          stagger,
          scrollTrigger: {
            trigger: el,
            start: triggerStart,
            once,
            scrub: scrub || false,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []); // 🔥 run only once

  return ref;
}