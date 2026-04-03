"use client";

import { useMotionValue, useSpring } from "framer-motion";

/* ================= HOOK ================= */

export function useTilt(intensity: number = 10) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);

  const rotateX = useSpring(rx, {
    stiffness: 140,
    damping: 18,
    mass: 0.4,
  });

  const rotateY = useSpring(ry, {
    stiffness: 140,
    damping: 18,
    mass: 0.4,
  });

  /* ================= MOVE ================= */

  const handleMove = (e: MouseEvent, rect: DOMRect) => {
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const x = (py - 0.5) * -intensity;
    const y = (px - 0.5) * intensity;

    rx.set(x);
    ry.set(y);
  };

  /* ================= RESET ================= */

  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return {
    rotateX,
    rotateY,
    handleMove,
    handleLeave,
  };
}