"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

type BadgeProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glow" | "outline" | "success" | "danger";
  animate?: boolean;
};

export default function Badge({
  children,
  className,
  variant = "default",
  animate = true,
}: BadgeProps) {
  const base =
    "inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[12px] font-medium backdrop-blur-md will-change-transform";

  const styles = {
    default:
      "bg-white/5 border border-white/10 text-gray-300",

    glow:
      "bg-white/5 border border-purple-400/30 text-white shadow-[0_0_25px_rgba(124,58,237,0.25)]",

    outline:
      "border border-white/20 text-gray-400 bg-transparent",

    success:
      "bg-green-500/10 border border-green-400/30 text-green-300",

    danger:
      "bg-red-500/10 border border-red-400/30 text-red-300",
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 6 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        scale: 1.05,
        y: -2,
      }}
      className={clsx(base, styles[variant], className)}
    >
      {/* 🔥 DOT (ANIMATED) */}
      <span className="relative flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 z-10" />

        {/* pulse */}
        <span className="absolute w-3 h-3 rounded-full bg-purple-400/40 animate-ping" />
      </span>

      {/* 🔥 TEXT */}
      <span className="tracking-wide leading-none">
        {children}
      </span>
    </motion.div>
  );
}