"use client";

import { motion, useTransform } from "framer-motion";
import { useMotion } from "../../systems/MotionProvider";
import DashboardPreview from "./DashboardPreview";

export default function HeroRight() {
  const { depth3X, depth3Y, drift } = useMotion();

  // 🔥 MICRO ROTATION (premium subtle)
  const rotateX = useTransform(depth3Y, [-20, 20], [3, -3]);
  const rotateY = useTransform(depth3X, [-20, 20], [-3, 3]);

  return (
    <motion.div
      style={{
        x: depth3X,
        y: depth3Y,
        translateY: drift,
      }}
      initial={{ opacity: 0, scale: 0.95, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.2,
      }}
      className="relative flex justify-center lg:justify-end"
    >
      {/* 🔥 MAIN CONTAINER */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1800,
        }}
        className="relative will-change-transform scale-[1.08] md:scale-[1.2]"
      >
        {/* 🔥 FLOATING LOOP */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <DashboardPreview />
        </motion.div>

        {/* 🔥 SHADOW ANCHOR (STRONGER REALISM) */}
        <div className="absolute bottom-[-70px] left-1/2 -translate-x-1/2 w-[75%] h-[70px] bg-black/70 blur-3xl rounded-full" />

        {/* 🔥 TOP LIGHT */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl 
        bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_60%)]" />

        {/* 🔥 FLOATING PRODUCT SIGNALS */}

        {/* CHIP 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 1, 0],
            y: [20, 0, -10],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          className="absolute -left-10 top-10 text-xs 
          bg-white/10 border border-white/20 px-3 py-1 
          rounded-lg backdrop-blur-md"
        >
          +₹12,400 today
        </motion.div>

        {/* CHIP 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 1, 0],
            y: [20, 0, -10],
          }}
          transition={{
            duration: 6,
            delay: 2,
            repeat: Infinity,
          }}
          className="absolute -right-8 top-24 text-xs 
          bg-white/10 border border-white/20 px-3 py-1 
          rounded-lg backdrop-blur-md"
        >
          32 new students
        </motion.div>

        {/* CHIP 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 1, 0],
            y: [20, 0, -10],
          }}
          transition={{
            duration: 6,
            delay: 4,
            repeat: Infinity,
          }}
          className="absolute left-10 bottom-6 text-xs 
          bg-white/10 border border-white/20 px-3 py-1 
          rounded-lg backdrop-blur-md"
        >
          Fees collected
        </motion.div>

      </motion.div>

      {/* 🔥 BACK GLOW (CONTROLLED) */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.22, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[650px] h-[650px] bg-purple-600/10 blur-[140px] rounded-full -z-10"
      />

      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[450px] h-[450px] bg-blue-500/6 blur-[120px] rounded-full -z-10"
      />
    </motion.div>
  );
}