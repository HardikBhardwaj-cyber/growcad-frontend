"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
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
  /* ================= MOUSE REACTION ================= */

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 120, damping: 20 });
  const sy = useSpring(y, { stiffness: 120, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    x.set(px);
    y.set(py);
  };

  /* ================= BASE ================= */

  const base =
    "relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-md overflow-hidden";

  const styles = {
    default:
      "bg-white/5 border border-white/10 text-white/80",

    glow:
      "border border-purple-400/30 text-white shadow-[0_10px_40px_rgba(124,58,237,0.35)]",

    outline:
      "border border-white/20 text-white/70 bg-transparent",
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.4 }}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {/* 🔥 ANIMATED GRADIENT (ONLY FOR GLOW) */}
      {variant === "glow" && (
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%"],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ backgroundSize: "200% 200%" }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20"
        />
      )}

      {/* 🔥 CURSOR LIGHT REACTION */}
      <motion.div
        style={{
          x: sx,
          y: sy,
        }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-xl opacity-40" />
      </motion.div>

      {/* 🔥 DOT INDICATOR */}
      <motion.span
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_12px_#7c3aed]"
      />

      {/* TEXT */}
      <span className="relative z-10 tracking-wide">
        {children}
      </span>
    </motion.div>
  );
}