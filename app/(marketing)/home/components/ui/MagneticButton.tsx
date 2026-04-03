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

  const sx = useSpring(mx, { stiffness: 160, damping: 16 });
  const sy = useSpring(my, { stiffness: 160, damping: 16 });

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    // 🔥 softer magnetic
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

  /* ================= COMPONENT ================= */

  return (
    <motion.button
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        x: sx,
        y: sy,
      }}
      whileHover={{ scale: 1.03 }} // 🔥 calmer
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`relative px-8 py-3.5 rounded-xl font-semibold text-white overflow-hidden will-change-transform ${className}`}
    >
      {/* 🔥 BASE GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500" />

      {/* 🔥 SOFT SHIMMER */}
      <motion.div
        initial={{ x: "-120%" }}
        whileHover={{ x: "120%" }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      {/* 🔥 CURSOR LIGHT (SOFTER) */}
      <motion.div
        style={{
          background: useTransform(
            [lightX, lightY],
            ([x, y]) =>
              `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.18), transparent 65%)`
          ),
        }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* 🔥 DEPTH */}
      <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-80 transition duration-300" />

      {/* 🔥 CONTENT (BREATHABLE) */}
      <span className="relative z-10 text-sm tracking-wide px-1">
        {children}
      </span>
    </motion.button>
  );
}