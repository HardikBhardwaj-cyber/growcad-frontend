"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "strong" | "outline";
  hover?: boolean;
};

export default function GlassCard({
  children,
  className,
  variant = "default",
  hover = true,
}: GlassCardProps) {
  /* ================= BASE ================= */

  const base =
    "relative rounded-2xl overflow-hidden backdrop-blur-xl border transition-all duration-500 will-change-transform";

  const variants = {
    default:
      "bg-white/5 border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.4)]",

    strong:
      "bg-white/10 border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)]",

    outline:
      "bg-transparent border-white/20",
  };

  return (
    <motion.div
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(base, variants[variant], className)}
    >
      {/* 🔥 INNER LIGHT */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60" />

      {/* 🔥 HOVER GLOW */}
      <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />

      {/* 🔥 BORDER SHINE */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5" />

      {/* 🔥 CONTENT */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}