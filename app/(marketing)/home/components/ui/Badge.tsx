"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { glowPulse } from "../../systems/variants";

type BadgeProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glow" | "outline";
};

export default function Badge({
  children,
  className = "",
  variant = "default",
}: BadgeProps) {
  /* 🔥 VARIANTS */

  const base =
    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-md";

  const styles = {
    default:
      "bg-white/5 border border-white/10 text-white/80",

    glow:
      "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]",

    outline:
      "border border-white/20 text-white/70 bg-transparent",
  };

  return (
    <motion.div
      variants={variant === "glow" ? glowPulse : undefined}
      animate={variant === "glow" ? "animate" : undefined}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {/* 🔥 DOT INDICATOR */}
      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_#7c3aed]" />

      {children}
    </motion.div>
  );
}