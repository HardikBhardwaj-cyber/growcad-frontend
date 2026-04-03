"use client";

import { motion, useTransform } from "framer-motion";
import { useMotion } from "../../systems/MotionProvider";
import DashboardPreview from "./DashboardPreview";

export default function HeroRight() {
  const { depth3X, depth3Y, drift } = useMotion();

  // 🔥 ULTRA SUBTLE ROTATION (premium feel)
  const rotateX = useTransform(depth3Y, [-20, 20], [2.5, -2.5]);
  const rotateY = useTransform(depth3X, [-20, 20], [-2.5, 2.5]);

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
      className="relative flex justify-center lg:justify-end lg:pr-6"
    >
      {/* ================= MAIN ================= */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformPerspective: 2000,
        }}
        className="relative will-change-transform scale-[0.9] md:scale-[1]"
      >
        {/* 🔥 FLOATING LOOP (VERY SUBTLE) */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <DashboardPreview />
        </motion.div>

        {/* 🔥 GROUND SHADOW (IMPORTANT FIX) */}
        <div className="absolute bottom-[-55px] left-1/2 -translate-x-1/2 w-[65%] h-[55px] bg-black/60 blur-2xl rounded-full" />

        {/* 🔥 TOP LIGHT */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl 
        bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_65%)]" />

        {/* ================= SMART FLOATING CHIPS ================= */}

        {/* REVENUE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 1, 0],
            y: [20, 0, -10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
          className="absolute -left-6 top-14 text-xs 
          bg-white/10 border border-white/20 px-3 py-1.5 
          rounded-lg backdrop-blur-md"
        >
          +₹12,400 today
        </motion.div>

        {/* STUDENTS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 1, 0],
            y: [20, 0, -10],
          }}
          transition={{
            duration: 7,
            delay: 2,
            repeat: Infinity,
          }}
          className="absolute -right-6 top-24 text-xs 
          bg-white/10 border border-white/20 px-3 py-1.5 
          rounded-lg backdrop-blur-md"
        >
          32 new students
        </motion.div>

        {/* FEES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 1, 0],
            y: [20, 0, -10],
          }}
          transition={{
            duration: 7,
            delay: 4,
            repeat: Infinity,
          }}
          className="absolute left-8 bottom-10 text-xs 
          bg-white/10 border border-white/20 px-3 py-1.5 
          rounded-lg backdrop-blur-md"
        >
          Fees collected
        </motion.div>
      </motion.div>

      {/* ================= BACK GLOW ================= */}
      <motion.div
        animate={{
          scale: [1, 1.04, 1],
          opacity: [0.14, 0.2, 0.14],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[600px] h-[600px] bg-purple-600/10 blur-[140px] rounded-full -z-10"
      />

      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[420px] h-[420px] bg-blue-500/6 blur-[120px] rounded-full -z-10"
      />
    </motion.div>
  );
}