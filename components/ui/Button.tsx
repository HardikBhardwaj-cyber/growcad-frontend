"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import clsx from "clsx";
import { ReactNode } from "react";

// ✅ USE MOTION TYPES (IMPORTANT)
type ButtonProps = {
  children: ReactNode;
  variant?: "gradient" | "secondary";
  loading?: boolean;
} & HTMLMotionProps<"button">;

export default function Button({
  children,
  variant = "gradient",
  loading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      disabled={disabled || loading}
      {...props}
      className={clsx(
        "relative px-6 py-3 rounded-xl font-semibold overflow-hidden",
        "transition-all duration-300 active:scale-95",
        "disabled:opacity-60 disabled:cursor-not-allowed",

        variant === "gradient" &&
          "bg-linear-to-r from-purple-600 to-blue-600 text-white",

        variant === "secondary" &&
          "bg-white/5 border border-white/10 text-white",

        className
      )}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {loading ? "Please wait" : children}
      </span>

      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-300">
        <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-blue-500 blur-xl opacity-30" />
      </div>
    </motion.button>
  );
}