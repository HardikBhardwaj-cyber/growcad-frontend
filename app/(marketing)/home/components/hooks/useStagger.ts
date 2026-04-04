"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type StaggerOptions = {
  y?: number;
  x?: number;
  scale?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  start?: string;
  once?: boolean;
  from?: "start" | "center" | "end" | "edges" | "random";
  immediate?: boolean; // 🔥 for hero (no scroll trigger)
};

export function useStagger(options: StaggerOptions = {}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 50,
      x = 0,
      scale = 1,
      duration = 0.8,
      stagger = 0.1,
      delay = 0,
      ease = "power3.out",
      start = "top 85%",
      once = true,
      from = "start",
      immediate = false,
    } = options;

    const ctx = gsap.context(() => {
      // 🔥 safer selector (supports nested elements)
      const targets = gsap.utils.toArray<HTMLElement>(
        el.querySelectorAll("[data-stagger]")
      );

      if (!targets.length) return;

      const animation = {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration,
        delay,
        ease,
        stagger: {
          each: stagger,
          from,
        },
      };

      // 🔥 initial state
      gsap.set(targets, {
        opacity: 0,
        y,
        x,
        scale: scale < 1 ? scale : 1,
      });

      if (immediate) {
        // 🔥 hero / instant animation
        gsap.to(targets, animation);
      } else {
        // 🔥 scroll-based animation
        gsap.to(targets, {
          ...animation,
          scrollTrigger: {
            trigger: el,
            start,
            once,
          },
        });
      }
    }, ref);

    return () => ctx.revert();
  }, []); // 🔥 run once

  return ref;
}