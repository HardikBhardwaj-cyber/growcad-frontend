"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let x = 0, y = 0;
    let tx = 0, ty = 0;

    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const loop = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;

      if (ref.current) {
        ref.current.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
      }

      requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move);
    loop();

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div
        ref={ref}
        className="absolute w-[600px] h-[600px] blur-[140px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.35), rgba(59,130,246,0.25), transparent 70%)",
        }}
      />
    </div>
  );
}