"use client";

import {
  useMotionValue,
  useSpring,
  useVelocity,
} from "framer-motion";
import { useEffect } from "react";

export function useMouse() {
  /* 🔥 RAW POSITION */
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  /* 🔥 SMOOTH FOLLOW */
  const smoothX = useSpring(x, {
    stiffness: 120,
    damping: 20,
  });

  const smoothY = useSpring(y, {
    stiffness: 120,
    damping: 20,
  });

  /* 🔥 VELOCITY */
  const vx = useVelocity(x);
  const vy = useVelocity(y);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, [x, y]);

  return {
    x,
    y,
    smoothX,
    smoothY,
    vx,
    vy,
  };
}