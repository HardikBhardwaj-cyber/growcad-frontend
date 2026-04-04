"use client";

import { useEffect, useRef } from "react";

export default function GridBackground() {
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf: number;
    let offset = 0;

    const animate = () => {
      offset += 0.05; // 🔥 speed (very subtle)

      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${offset}px, ${offset}px, 0)`;
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="absolute inset-0 z-[0] overflow-hidden pointer-events-none">
      
      {/* 🔥 BASE */}
      <div className="absolute inset-0 bg-black" />

      {/* 🔥 GRID (ANIMATED) */}
      <div
        ref={gridRef}
        className="absolute inset-0 opacity-[0.07] will-change-transform"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "42px 42px",
        }}
      />

      {/* 🔥 CENTER LIGHT (SOFT GLOW) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(120,120,255,0.12),transparent_60%)]" />

      {/* 🔥 DEPTH VIGNETTE */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8))]" />

      {/* 🔥 TOP FADE (TEXT READABILITY) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

    </div>
  );
}