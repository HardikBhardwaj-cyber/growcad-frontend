"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

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
  const base =
    "inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[12px] font-medium backdrop-blur-md";

  const styles = {
    default:
      "bg-white/5 border border-white/10 text-gray-300",

    glow:
      "bg-white/5 border border-purple-400/30 text-white shadow-[0_0_20px_rgba(124,58,237,0.25)]",

    outline:
      "border border-white/20 text-gray-400 bg-transparent",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {/* DOT */}
      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />

      {/* TEXT */}
      <span className="tracking-wide leading-none">
        {children}
      </span>
    </motion.div>
  );
}