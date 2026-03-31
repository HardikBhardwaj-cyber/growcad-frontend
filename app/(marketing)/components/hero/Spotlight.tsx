"use client";

import { useEffect, useState } from "react";

export default function Spotlight() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 transition-transform duration-200 ease-out"
        style={{
          transform: `translate(${pos.x - 300}px, ${pos.y - 300}px)`,
          background:
            "radial-gradient(circle, rgba(124,58,237,0.35), transparent 70%)",
        }}
      />
    </div>
  );
}