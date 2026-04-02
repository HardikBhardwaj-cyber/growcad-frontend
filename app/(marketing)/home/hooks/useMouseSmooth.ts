"use client";

import { useEffect, useRef } from "react";

type Position = { x: number; y: number };

export function useMouseSmooth(speed = 0.08) {
  const current = useRef<Position>({ x: 0, y: 0 });
  const target = useRef<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const loop = () => {
      current.current.x += (target.current.x - current.current.x) * speed;
      current.current.y += (target.current.y - current.current.y) * speed;

      requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMove);
    loop();

    return () => window.removeEventListener("mousemove", handleMove);
  }, [speed]);

  return current;
}