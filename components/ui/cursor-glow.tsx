"use client";

import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    window.addEventListener("mousemove", (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    });
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-50 w-40 h-40 rounded-full blur-3xl opacity-30"
      style={{
        left: pos.x - 80,
        top: pos.y - 80,
        background:
          "radial-gradient(circle, #a855f7, #6366f1, transparent)",
      }}
    />
  );
}