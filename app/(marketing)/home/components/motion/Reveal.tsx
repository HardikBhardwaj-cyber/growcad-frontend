"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type RevealProps = {
  children: React.ReactNode;
  y?: number;
  x?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  start?: string;
  once?: boolean;
};

export default function Reveal({
  children,
  y = 50,
  x = 0,
  duration = 0.8,
  stagger = 0.1,
  delay = 0,
  ease = "power3.out",
  start = "top 85%",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // 🔥 flexible targeting
      const targets = gsap.utils.toArray<HTMLElement>(
        el.querySelectorAll("[data-reveal]")
      );

      // fallback (single element)
      const elements = targets.length ? targets : [el];

      gsap.set(elements, {
        opacity: 0,
        y,
        x,
      });

      gsap.to(elements, {
        opacity: 1,
        y: 0,
        x: 0,
        duration,
        delay,
        ease,
        stagger: elements.length > 1 ? stagger : 0,
        scrollTrigger: {
          trigger: el,
          start,
          once,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}