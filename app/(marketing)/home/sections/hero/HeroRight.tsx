"use client";

import { motion, useTransform } from "framer-motion";
import { useMotion } from "../../systems/MotionProvider";
import DashboardPreview from "./DashboardPreview";

export default function HeroRight() {
  const { depth3X, depth3Y, drift } = useMotion();

  // 🔥 MICRO ROTATION (very subtle = premium)
  const rotateX = useTransform(depth3Y, [-20, 20], [4, -4]);
  const rotateY = useTransform(depth3X, [-20, 20], [-4, 4]);

  return (
    <motion.div
      style={{
        x: depth3X,
        y: depth3Y,
        translateY: drift,
      }}
      initial={{ opacity: 0, scale: 0.94, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.25,
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
        className="relative will-change-transform scale-[1.08] md:scale-[1.18]"
      >
        {/* FLOATING LOOP (more subtle) */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <DashboardPreview />
        </motion.div>

        {/* 🔥 SHADOW ANCHOR (stronger grounding) */}
        <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 w-[70%] h-[60px] bg-black/60 blur-3xl rounded-full" />

        {/* 🔥 SUBTLE TOP LIGHT (replaces cursor glow) */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl 
        bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
      </motion.div>

      {/* 🔥 BACK GLOW (MORE CONTROLLED) */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.18, 0.26, 0.18],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[600px] h-[600px] bg-purple-600/12 blur-[150px] rounded-full -z-10"
      />

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.06, 0.12, 0.06],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[420px] h-[420px] bg-blue-500/8 blur-[130px] rounded-full -z-10"
      />
    </motion.div>
  );
}