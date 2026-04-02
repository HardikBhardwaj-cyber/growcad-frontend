"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect } from "react";

export default function GridBackground() {
  // 🔥 cursor tracking
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });

  // 🔥 parallax layers
  const slowY = useTransform(my, (v) => v * -0.02);
  const midY = useTransform(my, (v) => v * -0.05);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* 🔥 FAR GRID (SLOW DRIFT) */}
      <motion.div
        style={{ y: slowY }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-[0.05]
        bg-[radial-gradient(#7c3aed_1px,transparent_1px)]
        [background-size:56px_56px]"
      />

      {/* 🔥 MID GRID (DEPTH) */}
      <motion.div
        style={{ y: midY }}
        animate={{ backgroundPosition: ["0% 0%", "-100% 100%"] }}
        transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-[0.04]
        bg-[linear-gradient(rgba(124,58,237,0.4)_1px,transparent_1px),
        linear-gradient(90deg,rgba(124,58,237,0.4)_1px,transparent_1px)]
        [background-size:90px_90px]"
      />

      {/* 🔥 PRIMARY LIGHT */}
      <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px]
        -translate-x-1/2 -translate-y-1/2
        bg-purple-600/20 blur-[220px] rounded-full"
      />

      {/* 🔥 SECONDARY LIGHT */}
      <div className="absolute top-[65%] left-[60%] w-[800px] h-[800px]
        -translate-x-1/2 -translate-y-1/2
        bg-blue-500/10 blur-[200px] rounded-full"
      />

      {/* 🔥 CURSOR LIGHT (SOFT ATTRACTION) */}
      <motion.div
        style={{ translateX: sx, translateY: sy }}
        className="pointer-events-none absolute z-[2]"
      >
        <div className="w-[500px] h-[500px]
          -translate-x-1/2 -translate-y-1/2
          bg-purple-500/10 blur-[160px] rounded-full"
        />
      </motion.div>

      {/* 🔥 ENERGY FLOW (VERY SUBTLE) */}
      <motion.div
        animate={{
          opacity: [0.08, 0.18, 0.08],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0
        bg-gradient-to-tr from-purple-900/10 via-transparent to-blue-900/10"
      />

      {/* 🔥 MICRO MESH (SUPER LIGHT) */}
      <div className="absolute inset-0 opacity-[0.03]
        bg-[radial-gradient(circle_at_20%_30%,#7c3aed_1px,transparent_1px),
        radial-gradient(circle_at_80%_70%,#3b82f6_1px,transparent_1px)]
        [background-size:120px_120px]"
      />

      {/* 🔥 VIGNETTE */}
      <div className="pointer-events-none absolute inset-0
        bg-[radial-gradient(circle_at_center,transparent_30%,#0a0a0f_100%)]"
      />
    </>
  );
}