"use client";

import { motion, useTransform } from "framer-motion";
import { useMotion } from "../../systems/MotionProvider";
import DashboardPreview from "./DashboardPreview";

export default function HeroRight() {
  const { depth3X, depth3Y, drift } = useMotion();

  /* 🔥 MICRO ROTATION (ULTRA PREMIUM) */
  const rotateX = useTransform(depth3Y, [-20, 20], [2, -2]);
  const rotateY = useTransform(depth3X, [-20, 20], [-2, 2]);

  return (
    <motion.div
      style={{
        x: depth3X,
        y: depth3Y,
        translateY: drift,
      }}
      initial={{ opacity: 0, scale: 0.96, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.25,
      }}
      className="relative flex justify-center lg:justify-end lg:pr-10"
    >
      {/* ================= MAIN ================= */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformPerspective: 2200,
        }}
        className="relative will-change-transform scale-[0.85] md:scale-[0.95]"
      >
        {/* 🔥 FLOATING (VERY MINIMAL) */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <DashboardPreview />
        </motion.div>

        {/* 🔥 GROUND SHADOW (ANCHOR FIX) */}
        <div className="absolute bottom-[-45px] left-1/2 -translate-x-1/2 w-[60%] h-[45px] bg-black/60 blur-2xl rounded-full" />

        {/* 🔥 SOFT LIGHT */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl 
        bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.04),transparent_70%)]" />

        {/* ================= ONLY 1 SIGNAL (FOCUS FIX) ================= */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 1, 0],
            y: [20, 0, -8],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
          className="absolute -left-4 top-16 text-xs 
          bg-white/10 border border-white/20 px-3 py-1.5 
          rounded-lg backdrop-blur-md"
        >
          +₹12,400 today
        </motion.div>
      </motion.div>

      {/* ================= CONTROLLED GLOW ================= */}
      <motion.div
        animate={{
          scale: [1, 1.03, 1],
          opacity: [0.12, 0.18, 0.12],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[520px] h-[520px] bg-purple-600/10 blur-[130px] rounded-full -z-10"
      />

      <motion.div
        animate={{
          scale: [1, 1.04, 1],
          opacity: [0.04, 0.08, 0.04],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[360px] h-[360px] bg-blue-500/5 blur-[110px] rounded-full -z-10"
      />
    </motion.div>
  );
}