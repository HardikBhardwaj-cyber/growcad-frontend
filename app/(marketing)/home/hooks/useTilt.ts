"use client";

import { useMotionValue, useSpring } from "framer-motion";

export function useTilt() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, { stiffness: 120, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 120, damping: 20 });

  const handleMove = (
    e: React.MouseEvent<HTMLDivElement>,
    rect: DOMRect
  ) => {
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    x.set((px - 0.5) * 20);
    y.set((py - 0.5) * -20);
  };

  return { smoothX, smoothY, handleMove };
}