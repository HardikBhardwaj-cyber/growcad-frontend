"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function CursorGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 120, damping: 25 });
  const sy = useSpring(y, { stiffness: 120, damping: 25 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* 🔥 SOFT LIGHT ONLY */}
      <motion.div
        style={{ translateX: sx, translateY: sy }}
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
      >
        <div className="w-[220px] h-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/15 blur-[80px]" />
      </motion.div>

      {/* 🔹 CORE DOT (SUBTLE) */}
      <motion.div
        style={{ translateX: sx, translateY: sy }}
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
      >
        <div className="w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/80" />
      </motion.div>
    </>
  );
}