"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

export default function Magnetic({
  children,
  strength = 0.35,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const state = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    raf: 0 as number | 0,
  });

  const lerp = (start: number, end: number, factor: number) =>
    start + (end - start) * factor;

  const animate = () => {
    const s = state.current;

    s.x = lerp(s.x, s.targetX, 0.18);
    s.y = lerp(s.y, s.targetY, 0.18);

    if (ref.current) {
      gsap.set(ref.current, {
        x: s.x,
        y: s.y,
      });
    }

    s.raf = requestAnimationFrame(animate);
  };

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    state.current.targetX = x * strength;
    state.current.targetY = y * strength;

    if (!state.current.raf) {
      state.current.raf = requestAnimationFrame(animate);
    }
  };

  const handleLeave = () => {
    state.current.targetX = 0;
    state.current.targetY = 0;

    gsap.to(state.current, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.35)",
      onUpdate: () => {
        if (ref.current) {
          gsap.set(ref.current, {
            x: state.current.x,
            y: state.current.y,
          });
        }
      },
    });
  };

  useEffect(() => {
    return () => {
      if (state.current.raf) cancelAnimationFrame(state.current.raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="inline-block will-change-transform"
    >
      {children}
    </div>
  );
}