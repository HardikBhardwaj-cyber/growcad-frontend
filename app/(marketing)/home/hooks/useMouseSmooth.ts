"use client";

import {
  useMotionValue,
  useVelocity,
  useTransform,
  MotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";

type Position = {
  x: number;
  y: number;
};

export function useMouseSmooth(speed: number = 0.08) {
  /* ================= TARGET ================= */

  const target = useRef<Position>({ x: 0, y: 0 });

  /* ================= MOTION VALUES ================= */

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 🔥 LAG LAYER (depth illusion)
  const lagX = useMotionValue(0);
  const lagY = useMotionValue(0);

  /* ================= VELOCITY ================= */

  const vx = useVelocity(x);
  const vy = useVelocity(y);

  // 🔥 SAFE SPEED CALCULATION
  const speedValue = useTransform(
    [vx, vy],
    (latest) => {
        const [vxVal, vyVal] = latest as [number, number];

        const velocity = Math.sqrt(vxVal * vxVal + vyVal * vyVal);
        return Math.min(velocity, 1000);
    }
  );

  /* ================= RAF LOOP ================= */

  const raf = useRef<number | null>(null);

  useEffect(() => {
    // ✅ SAFE: only runs on client
    const handleMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const loop = () => {
      const tx = target.current.x;
      const ty = target.current.y;

      /* 🔥 MAIN SMOOTH (LERP) */
      const cx = x.get() + (tx - x.get()) * speed;
      const cy = y.get() + (ty - y.get()) * speed;

      x.set(cx);
      y.set(cy);

      /* 🔥 LAG (SECOND LAYER DEPTH) */
      const lx = lagX.get() + (cx - lagX.get()) * (speed * 0.5);
      const ly = lagY.get() + (cy - lagY.get()) * (speed * 0.5);

      lagX.set(lx);
      lagY.set(ly);

      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMove);
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [speed, x, y, lagX, lagY]);

  /* ================= RETURN ================= */

  return {
    x,        // smooth cursor
    y,
    lagX,     // delayed cursor (depth)
    lagY,
    vx,       // velocity X
    vy,       // velocity Y
    speed: speedValue, // combined speed
  };
}