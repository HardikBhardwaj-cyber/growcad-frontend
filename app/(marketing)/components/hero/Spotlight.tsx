"use client";

import { useEffect, useState } from "react";

export default function Spotlight() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        background: `radial-gradient(600px at ${position.x}px ${position.y}px, rgba(124,58,237,0.15), transparent 80%)`,
      }}
    />
  );
}