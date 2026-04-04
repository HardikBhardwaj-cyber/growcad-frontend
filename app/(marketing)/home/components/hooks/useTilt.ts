"use client";

import { useRef } from "react";

export function useTilt(maxTilt = 15) {
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

    s.x = lerp(s.x, s.targetX, 0.12);
    s.y = lerp(s.y, s.targetY, 0.12);

    if (ref.current) {
      ref.current.style.transform = `
        perspective(1000px)
        rotateX(${s.x}deg)
        rotateY(${s.y}deg)
        scale3d(1.02, 1.02, 1.02)
      `;
    }

    s.raf = requestAnimationFrame(animate);
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const midX = rect.width / 2;
    const midY = rect.height / 2;

    state.current.targetX = ((y - midY) / midY) * maxTilt;
    state.current.targetY = ((x - midX) / midX) * -maxTilt;

    if (!state.current.raf) {
      state.current.raf = requestAnimationFrame(animate);
    }
  };

  const handleLeave = () => {
    state.current.targetX = 0;
    state.current.targetY = 0;
  };

  return {
    ref,
    handleMove,
    handleLeave,
  };
}