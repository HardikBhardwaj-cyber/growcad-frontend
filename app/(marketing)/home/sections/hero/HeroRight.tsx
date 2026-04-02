"use client";

import { motion, useTransform } from "framer-motion";
import { useMotion } from "../../systems/MotionProvider";
import DashboardPreview from "./DashboardPreview";

export default function HeroRight() {
  const { depth3X, depth3Y, drift, mouseX, mouseY } = useMotion();

  // 🔥 LIGHT REACTION (cursor based)
  const glowX = useTransform(mouseX, [0, 1], [-40, 40]);
  const glowY = useTransform(mouseY, [0, 1], [-40, 40]);

  // 🔥 MICRO ROTATION (premium feel)
  const rotateX = useTransform(depth3Y, [-20, 20], [6, -6]);
  const rotateY = useTransform(depth3X, [-20, 20], [-6, 6]);

  return (
    <motion.div
      style={{
        x: depth3X,
        y: depth3Y,
        translateY: drift,
      }}
      initial={{ opacity: 0, scale: 0.9, y: 80 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.4,
      }}
      className="relative flex justify-center lg:justify-end"
    >

      {/* 🔥 MAIN DEPTH CONTAINER */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1400,
        }}
        className="relative will-change-transform"
      >

        {/* 🔥 FLOATING LOOP */}
        <motion.div
          animate={{
            y: [0, -14, 0],
            rotate: [0, 0.6, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <DashboardPreview />
        </motion.div>

        {/* 🔥 CURSOR LIGHT (NEXT LEVEL) */}
        <motion.div
          style={{
            x: glowX,
            y: glowY,
          }}
          className="pointer-events-none absolute inset-0 rounded-2xl"
        >
          <div className="w-full h-full bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-40 blur-2xl rounded-2xl" />
        </motion.div>

      </motion.div>

      {/* 🔥 BACK GLOW LAYER 1 */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[700px] h-[700px] bg-purple-600/20 blur-[180px] rounded-full -z-10"
      />

      {/* 🔥 BACK GLOW LAYER 2 (DEPTH COLOR MIX) */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[160px] rounded-full -z-10"
      />

    </motion.div>
  );
}