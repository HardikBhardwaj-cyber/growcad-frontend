"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  const rafRef = useRef<number | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    // 🔥 disable on touch devices
    if ("ontouchstart" in window) {
      if (glowRef.current) glowRef.current.style.display = "none";
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 🔥 smoother easing than lerp
    const ease = 0.12;

    const animate = () => {
      if (!mounted.current) return;

      current.current.x += (mouse.current.x - current.current.x) * ease;
      current.current.y += (mouse.current.y - current.current.y) * ease;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      mounted.current = false;

      window.removeEventListener("mousemove", handleMouseMove);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="
        pointer-events-none fixed top-0 left-0 z-[0]
        w-[420px] h-[420px]
        -translate-x-1/2 -translate-y-1/2
        rounded-full
        bg-white/10
        blur-[120px]
        will-change-transform
      "
    />
  );
}