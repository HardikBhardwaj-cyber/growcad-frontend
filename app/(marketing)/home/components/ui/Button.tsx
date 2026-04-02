"use client";

import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

/* ================= COMPONENT ================= */

export default function Button({
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  /* 🔥 MAGNETIC EFFECT */

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    ref.current!.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const handleLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0px, 0px)";
  };

  /* 🔥 STYLES */

  const base =
    "relative inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold overflow-hidden transition-all duration-300";

  const styles = {
    primary:
      "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]",

    secondary:
      "bg-white/5 border border-white/10 text-white/80 backdrop-blur-md",

    ghost:
      "text-white/70 hover:text-white bg-transparent",
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.95 }}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {/* 🔥 SHIMMER EFFECT */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 animate-[shimmer_2s_infinite]" />
      </span>

      {/* 🔥 CONTENT */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}