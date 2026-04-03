"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export default function Button({
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  /* ================= MAGNETIC SYSTEM ================= */

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    mx.set(x * 0.25);
    my.set(y * 0.25);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  /* ================= LIGHT EFFECT ================= */

  const lightX = useTransform(mx, [-50, 50], [0, 100]);
  const lightY = useTransform(my, [-50, 50], [0, 100]);

  /* ================= BASE ================= */

  const base =
    "relative inline-flex items-center justify-center px-7 py-3 rounded-xl font-semibold overflow-hidden will-change-transform";

  const styles = {
    primary:
      "text-white bg-gradient-to-r from-purple-500 to-blue-500 shadow-[0_10px_40px_rgba(124,58,237,0.4)]",

    secondary:
      "bg-white/5 border border-white/10 text-white/80 backdrop-blur-md",

    ghost:
      "text-white/70 hover:text-white bg-transparent",
  };

  return (
    <motion.button
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        x: sx,
        y: sy,
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {/* 🔥 SHIMMER (ONLY ON HOVER) */}
      <motion.div
        initial={{ x: "-120%" }}
        whileHover={{ x: "120%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />

      {/* 🔥 CURSOR LIGHT */}
      <motion.div
        style={{
          background: useTransform(
            [lightX, lightY],
            ([x, y]) =>
              `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.2), transparent 60%)`
          ),
        }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* 🔥 DEPTH OVERLAY */}
      <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition" />

      {/* 🔥 CONTENT */}
      <span className="relative z-10 tracking-wide">
        {children}
      </span>
    </motion.button>
  );
}