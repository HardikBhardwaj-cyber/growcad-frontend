"use client";

import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 transition-transform duration-300"
        style={{
          transform: `translate(${pos.x - 250}px, ${pos.y - 250}px)`,
          background:
            "radial-gradient(circle, rgba(124,58,237,0.4), transparent 70%)",
        }}
      />
    </div>
  );
}