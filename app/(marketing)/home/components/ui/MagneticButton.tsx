"use client";

import { useRef } from "react";

export default function MagneticButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLButtonElement | null>(null);

  const move = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return; // ✅ FIX

    const rect = ref.current.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    ref.current.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const leave = () => {
    if (!ref.current) return; // ✅ FIX

    ref.current.style.transform = "translate(0,0)";
  };

  return (
    <button
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-500 to-blue-500 text-white font-semibold transition"
    >
      {children}
    </button>
  );
}