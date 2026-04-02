"use client";

import {
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import { useRef } from "react";

type TiltReturn = {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  glareX: MotionValue<string>;
  glareY: MotionValue<string>;
  handleMove: (
    e: React.MouseEvent<HTMLElement>,
    rect: DOMRect
  ) => void;
  handleLeave: () => void;
};

export function useTilt(strength = 18): TiltReturn {
  /* ================= RAW ================= */

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  /* ================= SPRING ================= */

  const smoothX = useSpring(x, {
    stiffness: 140,
    damping: 18,
  });

  const smoothY = useSpring(y, {
    stiffness: 140,
    damping: 18,
  });

  /* ================= ROTATION ================= */

  const rotateX = useTransform(smoothY, (val) => -val);
  const rotateY = useTransform(smoothX, (val) => val);

  /* ================= GLARE ================= */

  const glareX = useTransform(
    smoothX,
    [-strength, strength],
    ["0%", "100%"]
  );

  const glareY = useTransform(
    smoothY,
    [-strength, strength],
    ["0%", "100%"]
  );

  /* ================= HANDLERS ================= */

  const handleMove = (
    e: React.MouseEvent<HTMLElement>,
    rect: DOMRect
  ) => {
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    x.set((px - 0.5) * strength);
    y.set((py - 0.5) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return {
    rotateX,
    rotateY,
    glareX,
    glareY,
    handleMove,
    handleLeave,
  };
}