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
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(500px at ${pos.x}px ${pos.y}px, rgba(124,58,237,0.15), transparent 80%)`,
      }}
    />
  );
}