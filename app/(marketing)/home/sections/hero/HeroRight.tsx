"use client";

import { motion, useTransform } from "framer-motion";
import { useMotion } from "../../systems/MotionProvider";
import DashboardPreview from "./DashboardPreview";

export default function HeroRight() {
  const { depth3X, depth3Y, drift } = useMotion();

  /* 🔥 ULTRA SUBTLE ROTATION */
  const rotateX = useTransform(depth3Y, [-20, 20], [1.8, -1.8]);
  const rotateY = useTransform(depth3X, [-20, 20], [-1.8, 1.8]);

  return (
    <motion.div
      style={{
        x: depth3X,
        y: depth3Y,
        translateY: drift,
      }}
      initial={{ opacity: 0, scale: 0.97, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.25,
      }}
      className="relative flex justify-center lg:justify-end lg:pr-12"
    >
      {/* ================= MAIN ================= */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformPerspective: 2400,
        }}
        className="relative will-change-transform scale-[0.78] md:scale-[0.88]"
      >
        {/* 🔥 FLOATING (CONTROLLED) */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <DashboardPreview />
        </motion.div>

        {/* 🔥 STRONGER GROUNDING */}
        <div className="absolute bottom-[-38px] left-1/2 -translate-x-1/2 w-[55%] h-[40px] bg-black/70 blur-2xl rounded-full" />

        {/* 🔥 SOFT TOP LIGHT */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl 
        bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.035),transparent_75%)]" />

        {/* 🔥 SINGLE SIGNAL (ALIGNED) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{
            opacity: [0, 1, 0],
            y: [16, 0, -6],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
          className="absolute left-2 top-12 text-[11px] 
          bg-white/10 border border-white/15 px-3 py-1 
          rounded-md backdrop-blur-md"
        >
          +₹12,400 today
        </motion.div>
      </motion.div>

      {/* ================= BACK GLOW (REDUCED) ================= */}
      <motion.div
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.1, 0.16, 0.1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[440px] h-[440px] bg-purple-600/10 blur-[120px] rounded-full -z-10"
      />

      <motion.div
        animate={{
          scale: [1, 1.03, 1],
          opacity: [0.03, 0.07, 0.03],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full -z-10"
      />
    </motion.div>
  );
}