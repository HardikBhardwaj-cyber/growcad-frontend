"use client";

import { useEffect, useRef } from "react";
import { useMouseSmooth } from "../../hooks/useMouseSmooth";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null);
  const glowInnerRef = useRef<HTMLDivElement | null>(null);

  const pos = useMouseSmooth(0.1);

  useEffect(() => {
    const animate = () => {
      const { x, y } = pos.current;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
      }

      if (glowInnerRef.current) {
        glowInnerRef.current.style.transform = `translate(${x - 120}px, ${y - 120}px)`;
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [pos]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">

      {/* OUTER AURA (SOFT BIG GLOW) */}
      <div
        ref={glowRef}
        className="absolute w-[600px] h-[600px] rounded-full blur-[160px] opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.25), rgba(59,130,246,0.15), transparent 70%)",
        }}
      />

      {/* INNER CORE (STRONGER CENTER) */}
      <div
        ref={glowInnerRef}
        className="absolute w-[240px] h-[240px] rounded-full blur-[80px] opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.35), rgba(59,130,246,0.25), transparent 70%)",
        }}
      />

    </div>
  );
}