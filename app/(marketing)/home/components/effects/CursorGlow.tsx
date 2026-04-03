"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null);

  // Target position (real mouse)
  const mouse = useRef({ x: 0, y: 0 });

  // Smooth position (animated)
  const current = useRef({ x: 0, y: 0 });

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
      // Smooth follow (0.08 = smoothness)
      current.current.x = lerp(current.current.x, mouse.current.x, 0.08);
      current.current.y = lerp(current.current.y, mouse.current.y, 0.08);

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${current.current.x - 200}px, ${current.current.y - 200}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed top-0 left-0 w-[400px] h-[400px] rounded-full bg-white/10 blur-[120px] z-0"
    />
  );
}