"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function MagneticButton({ children, className = "" }: Props) {
  /* 🔥 MOTION VALUES */
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  /* 🔥 SMOOTH SPRING */
  const smoothX = useSpring(x, { stiffness: 150, damping: 15 });
  const smoothY = useSpring(y, { stiffness: 150, damping: 15 });

  /* 🔥 MOUSE MOVE */
  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    x.set((px - 0.5) * 30);
    y.set((py - 0.5) * 30);
  };

  /* 🔥 RESET */
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      style={{
        x: smoothX,
        y: smoothY,
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.95 }}
      className={`relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden ${className}`}
    >
      {/* 🔥 GRADIENT BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500" />

      {/* 🔥 GLOW LAYER */}
      <motion.div
        animate={{
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-purple-500 blur-xl opacity-50"
      />

      {/* 🔥 CONTENT */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}