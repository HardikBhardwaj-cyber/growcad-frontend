"use client";

import { motion, useTransform } from "framer-motion";
import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";
import { useMotion } from "../../systems/MotionProvider";

export default function Hero() {
  const { scrollProgress } = useMotion();

  /* 🔥 SCROLL STORYTELLING */
  const opacity = useTransform(scrollProgress, [0, 0.4], [1, 0.6]);
  const scale = useTransform(scrollProgress, [0, 0.4], [1, 0.96]);
  const y = useTransform(scrollProgress, [0, 0.4], [0, -60]);

  return (
    <motion.section
      style={{ opacity, scale, y }}
      className="relative min-h-screen flex items-center overflow-hidden"
    >

      {/* 🌌 GLOBAL BACKGROUND SYSTEM */}

      {/* GRID */}
      <div className="absolute inset-0 bg-grid opacity-[0.035]" />

      {/* PRIMARY GLOW */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2 bg-purple-600/20 blur-[200px] rounded-full"
      />

      {/* SECONDARY GLOW */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-blue-500/20 blur-[160px] rounded-full"
      />

      {/* FLOATING PARTICLES */}
      <motion.div
        animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute left-[8%] top-[20%] w-3 h-3 bg-purple-400 rounded-full blur-sm opacity-50"
      />

      {/* 🔥 MAIN WRAPPER */}
      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-20">

        {/* 🔥 FLEX CENTER SYSTEM */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[80vh]">

          {/* LEFT */}
          <div className="flex justify-center lg:justify-start">
            <div className="max-w-xl w-full">
              <HeroLeft />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center lg:justify-end">
            <HeroRight />
          </div>

        </div>

      </div>

      {/* 🔥 BOTTOM FADE (CONNECT NEXT SECTION) */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-[#0a0a0f]" />

    </motion.section>
  );
}