"use client";

import { motion, useTransform } from "framer-motion";
import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";
import { useMotion } from "../../systems/MotionProvider";

export default function Hero() {
  const { scrollProgress } = useMotion();

  const opacity = useTransform(scrollProgress, [0, 0.4], [1, 0.8]);
  const scale = useTransform(scrollProgress, [0, 0.4], [1, 0.985]);
  const y = useTransform(scrollProgress, [0, 0.4], [0, -30]);

  return (
    <motion.section
      style={{ opacity, scale, y }}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0f]"
    >
      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 bg-grid opacity-[0.02]" />

      <div className="absolute inset-0 
      bg-[radial-gradient(circle_at_65%_40%,rgba(124,58,237,0.18),transparent_60%)]" />

      <div className="absolute inset-0 
      bg-[radial-gradient(circle_at_25%_30%,rgba(59,130,246,0.08),transparent_50%)]" />

      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay bg-[url('/noise.png')]" />

      {/* FLOATING ORB */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
        className="absolute left-[12%] top-[30%] w-2.5 h-2.5 bg-purple-400 rounded-full blur-sm opacity-50"
      />

      {/* ================= CONTENT ================= */}

      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] items-center min-h-[85vh] gap-12">

          {/* LEFT */}
          <div className="flex justify-start">
            <div className="max-w-[620px] w-full">
              <HeroLeft />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center lg:justify-end lg:pr-4 mt-12 lg:mt-0">
            <HeroRight />
          </div>

        </div>
      </div>

      {/* ================= BOTTOM FADE ================= */}
      <div className="absolute bottom-0 left-0 w-full h-40 
      bg-gradient-to-b from-transparent to-[#0a0a0f]" />
    </motion.section>
  );
}