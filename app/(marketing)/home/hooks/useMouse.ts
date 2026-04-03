"use client";

import {
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
  MotionValue,
} from "framer-motion";
import { useEffect, useState } from "react";

export function useMouse() {
  /* ================= RAW ================= */

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  /* ================= VIEWPORT ================= */

  const [vw, setVw] = useState(1920);
  const [vh, setVh] = useState(1080);

  useEffect(() => {
    const update = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  /* ================= SMOOTH ================= */

  const smoothX = useSpring(x, {
    stiffness: 140,
    damping: 22,
    mass: 0.6,
  });

  const smoothY = useSpring(y, {
    stiffness: 140,
    damping: 22,
    mass: 0.6,
  });

  /* 🔥 LAG (DEPTH LAYER) */
  const lagX = useSpring(x, {
    stiffness: 60,
    damping: 20,
  });

  const lagY = useSpring(y, {
    stiffness: 60,
    damping: 20,
  });

  /* ================= NORMALIZED ================= */

  // 0 → 1
  const nx = useTransform(smoothX, [0, vw], [0, 1]);
  const ny = useTransform(smoothY, [0, vh], [0, 1]);

  // -1 → 1 (CENTER BASED = GOLD)
  const cx = useTransform(nx, [0, 1], [-1, 1]);
  const cy = useTransform(ny, [0, 1], [-1, 1]);

  /* ================= VELOCITY ================= */

  const vx = useVelocity(x);
  const vy = useVelocity(y);

  const speed: MotionValue<number> = useTransform(
    [vx, vy],
    (latest: number[]) => {
      const vxVal = latest[0];
      const vyVal = latest[1];
      return Math.min(Math.sqrt(vxVal * vxVal + vyVal * vyVal), 1000);
    }
  );

  /* ================= EVENTS ================= */

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

  /* ================= RETURN ================= */

  return {
    x,
    y,

    smoothX,
    smoothY,

    lagX,
    lagY,

    nx, // 0 → 1
    ny,

    cx, // -1 → 1 (IMPORTANT)
    cy,

    vx,
    vy,
    speed,
  };
}