"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function MagneticButton({
  children,
  className = "",
}: Props) {
  /* ================= MAGNETIC ================= */

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 220, damping: 18 });
  const sy = useSpring(my, { stiffness: 220, damping: 18 });

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    // 🔥 reduced = premium
    mx.set(x * 0.18);
    my.set(y * 0.18);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  /* ================= LIGHT ================= */

  const lightX = useTransform(mx, [-40, 40], [0, 100]);
  const lightY = useTransform(my, [-40, 40], [0, 100]);

  /* ================= COMPONENT ================= */

  return (
    <motion.button
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        x: sx,
        y: sy,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative px-7 py-3 rounded-xl font-semibold text-white overflow-hidden will-change-transform ${className}`}
    >
      {/* 🔥 BASE GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500" />

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
              `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.25), transparent 60%)`
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