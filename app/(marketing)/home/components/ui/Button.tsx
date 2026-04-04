"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  loading = false,
}: ButtonProps) {
  /* ================= MOTION VALUES ================= */

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 140, damping: 18 });
  const sy = useSpring(my, { stiffness: 140, damping: 18 });

  const shouldReduceMotion = useReducedMotion();

  /* ================= EVENTS ================= */

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || shouldReduceMotion) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    mx.set(x * 0.15);
    my.set(y * 0.15);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  /* ================= LIGHT ================= */

  const lightX = useTransform(mx, [-40, 40], [20, 80]);
  const lightY = useTransform(my, [-40, 40], [20, 80]);

  // ✅ FIXED (NO useMemo, React-safe)
  const lightBg = useTransform(
    [lightX, lightY],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15), transparent 65%)`
  );

  /* ================= STYLES ================= */

  const base =
    "relative inline-flex items-center justify-center rounded-xl font-semibold overflow-hidden will-change-transform transition";

  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-7 py-3 text-sm",
    lg: "px-10 py-4 text-base",
  };

  const variants = {
    primary:
      "text-white bg-gradient-to-r from-purple-500 to-blue-500 shadow-[0_12px_40px_rgba(124,58,237,0.45)]",

    secondary:
      "bg-white/5 border border-white/10 text-white/80 backdrop-blur-md",

    ghost:
      "text-white/70 hover:text-white bg-transparent",
  };

  /* ================= RENDER ================= */

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        x: shouldReduceMotion ? 0 : sx,
        y: shouldReduceMotion ? 0 : sy,
      }}
      whileHover={
        !disabled && !shouldReduceMotion ? { scale: 1.03 } : {}
      }
      whileTap={!disabled ? { scale: 0.96 } : {}}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className={clsx(
        base,
        sizes[size],
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* 🔥 SHIMMER */}
      {!shouldReduceMotion && (
        <motion.div
          initial={{ x: "-120%" }}
          whileHover={{ x: "120%" }}
          transition={{ duration: 1.1 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      )}

      {/* 🔥 CURSOR LIGHT */}
      {!shouldReduceMotion && (
        <motion.div
          style={{ background: lightBg }}
          className="absolute inset-0 pointer-events-none"
        />
      )}

      {/* 🔥 DEPTH */}
      <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-80 transition duration-300" />

      {/* 🔥 CONTENT */}
      <span className="relative z-10 flex items-center gap-2 tracking-wide">
        {loading && (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        )}
        {children}
      </span>
    </motion.button>
  );
}