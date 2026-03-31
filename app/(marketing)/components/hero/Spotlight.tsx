"use client";

import { useMouse } from "../hooks/useMouse";

export default function Spotlight() {
  const { x, y } = useMouse();

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(600px at ${x}px ${y}px, rgba(124,58,237,0.12), transparent 80%)`,
      }}
    />
  );
}