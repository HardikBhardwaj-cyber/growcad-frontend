"use client";

import { useEffect, useRef } from "react";

export function useMouse(smoothness: number = 0.1) {
  const mouse = useRef({ x: 0, y: 0 });     // real mouse
  const current = useRef({ x: 0, y: 0 });   // smooth position

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      current.current.x = lerp(current.current.x, mouse.current.x, smoothness);
      current.current.y = lerp(current.current.y, mouse.current.y, smoothness);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [smoothness]);

  return {
    mouse,
    current,
  };
}