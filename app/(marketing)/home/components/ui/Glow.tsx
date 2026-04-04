"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

type GlowProps = {
  variant?: "purple" | "blue" | "mixed";
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
};

export default function Glow({
  variant = "mixed",
  size = "lg",
  className,
  animate = true,
}: GlowProps) {
  const sizes = {
    sm: "w-[300px] h-[300px]",
    md: "w-[500px] h-[500px]",
    lg: "w-[800px] h-[800px]",
  };

  const colors = {
    purple: "bg-purple-600/30",
    blue: "bg-blue-500/25",
    mixed: "",
  };

  return (
    <>
      {/* 🔥 TOP GLOW */}
      <motion.div
        initial={animate ? { opacity: 0, scale: 0.8 } : false}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.2 }}
        className={clsx(
          "pointer-events-none absolute top-[-200px] left-1/2 -translate-x-1/2 blur-[140px] rounded-full",
          sizes[size],
          variant === "mixed" ? "bg-purple-600/30" : colors[variant],
          className
        )}
      />

      {/* 🔥 BOTTOM GLOW */}
      <motion.div
        initial={animate ? { opacity: 0, scale: 0.8 } : false}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1.4 }}
        className={clsx(
          "pointer-events-none absolute bottom-[-200px] left-1/2 -translate-x-1/2 blur-[140px] rounded-full",
          sizes[size],
          variant === "mixed" ? "bg-blue-500/25" : colors[variant],
          className
        )}
      />
    </>
  );
}