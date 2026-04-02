"use client";

import { motion, useTransform } from "framer-motion";
import { useMotion } from "../../systems/MotionProvider";
import DashboardPreview from "./DashboardPreview";

export default function HeroRight() {
  const { depth3X, depth3Y, drift, mouseX, mouseY } = useMotion();

  // 🔥 CURSOR LIGHT
  const glowX = useTransform(mouseX, [0, 1], [-30, 30]);
  const glowY = useTransform(mouseY, [0, 1], [-30, 30]);

  // 🔥 MICRO ROTATION (reduced = more premium)
  const rotateX = useTransform(depth3Y, [-20, 20], [5, -5]);
  const rotateY = useTransform(depth3X, [-20, 20], [-5, 5]);

  return (
    <motion.div
      style={{
        x: depth3X,
        y: depth3Y,
        translateY: drift,
      }}
      initial={{ opacity: 0, scale: 0.92, y: 60 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.3,
      }}
      className="relative flex justify-center lg:justify-end"
    >
      {/* 🔥 MAIN CONTAINER */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1600,
        }}
        className="relative will-change-transform scale-[1.05] md:scale-[1.15]"
      >
        {/* FLOATING LOOP */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <DashboardPreview />
        </motion.div>

        {/* 🔥 CURSOR LIGHT */}
        <motion.div
          style={{
            x: glowX,
            y: glowY,
          }}
          className="pointer-events-none absolute inset-0 rounded-3xl"
        >
          <div className="w-full h-full bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-30 blur-2xl rounded-3xl" />
        </motion.div>

        {/* 🔥 SHADOW ANCHOR (VERY IMPORTANT) */}
        <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 w-[65%] h-[50px] bg-black/50 blur-2xl rounded-full" />
      </motion.div>

      {/* 🔥 BACK GLOW (REDUCED = CLEANER) */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[650px] h-[650px] bg-purple-600/15 blur-[160px] rounded-full -z-10"
      />

      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[450px] h-[450px] bg-blue-500/10 blur-[140px] rounded-full -z-10"
      />
    </motion.div>
  );
}