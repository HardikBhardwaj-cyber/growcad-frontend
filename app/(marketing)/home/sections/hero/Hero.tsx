"use client";

import { motion, useTransform } from "framer-motion";
import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";
import { useMotion } from "../../systems/MotionProvider";

export default function Hero() {
  const { scrollProgress } = useMotion();

  /* 🔥 SCROLL FEEL (SMOOTHER + PREMIUM) */
  const opacity = useTransform(scrollProgress, [0, 0.4], [1, 0.85]);
  const scale = useTransform(scrollProgress, [0, 0.4], [1, 0.985]);
  const y = useTransform(scrollProgress, [0, 0.4], [0, -25]);

  return (
    <motion.section
      style={{ opacity, scale, y }}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0f]"
    >
      {/* ================= 🌌 BACKGROUND SYSTEM ================= */}

      {/* GRID */}
      <div className="absolute inset-0 bg-grid opacity-[0.018]" />

      {/* PRIMARY LIGHT (FOCUS RIGHT) */}
      <div className="absolute inset-0 
      bg-[radial-gradient(circle_at_70%_45%,rgba(124,58,237,0.22),transparent_60%)]" />

      {/* SECONDARY LIGHT (LEFT BALANCE) */}
      <div className="absolute inset-0 
      bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)]" />

      {/* NOISE */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay bg-[url('/noise.png')]" />

      {/* FLOATING ORB */}
      <motion.div
        animate={{ y: [0, -18, 0], x: [0, 12, 0] }}
        transition={{ duration: 16, repeat: Infinity }}
        className="absolute left-[10%] top-[32%] w-2 h-2 bg-purple-400 rounded-full blur-sm opacity-40"
      />

      {/* ================= 🚀 CONTENT ================= */}

      <div className="relative w-full max-w-[1500px] mx-auto 
      px-6 md:px-16 lg:px-24 xl:px-32">

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] items-center min-h-[88vh]">

          {/* 🔥 LEFT (SHIFTED RIGHT FOR BREATHING SPACE) */}
          <div className="flex justify-start pl-2 md:pl-6 lg:pl-10 xl:pl-14">
            <div className="max-w-[540px] w-full">
              <HeroLeft />
            </div>
          </div>

          {/* 🔥 RIGHT (FOCUS AREA) */}
          <div className="flex justify-center lg:justify-end mt-14 lg:mt-0">
            <HeroRight />
          </div>

        </div>
      </div>

      {/* ================= 🔥 DEPTH OVERLAY ================= */}

      {/* TOP FADE */}
      <div className="absolute top-0 left-0 w-full h-32 
      bg-gradient-to-b from-[#0a0a0f] to-transparent pointer-events-none" />

      {/* BOTTOM FADE */}
      <div className="absolute bottom-0 left-0 w-full h-40 
      bg-gradient-to-b from-transparent to-[#0a0a0f]" />
    </motion.section>
  );
}