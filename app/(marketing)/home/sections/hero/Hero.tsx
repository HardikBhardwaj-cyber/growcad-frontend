"use client";

import { motion, useTransform } from "framer-motion";
import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";
import { useMotion } from "../../systems/MotionProvider";

export default function Hero() {
  const { scrollProgress } = useMotion();

  const opacity = useTransform(scrollProgress, [0, 0.4], [1, 0.7]);
  const scale = useTransform(scrollProgress, [0, 0.4], [1, 0.97]);
  const y = useTransform(scrollProgress, [0, 0.4], [0, -40]);

  return (
    <motion.section
      style={{ opacity, scale, y }}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0f]"
    >
      {/* 🔥 DEPTH BACKGROUND */}

      {/* GRID */}
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />

      {/* MAIN RADIAL GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(124,58,237,0.25),transparent_60%)]" />

      {/* SECONDARY LIGHT */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%)]" />

      {/* NOISE TEXTURE (IMPORTANT) */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('/noise.png')]" />

      {/* FLOATING ORB */}
      <motion.div
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute left-[10%] top-[25%] w-3 h-3 bg-purple-400 rounded-full blur-sm opacity-60"
      />

      {/* 🔥 CONTENT */}
      <div className="relative w-full max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] items-center min-h-[85vh]">

          {/* LEFT */}
          <div className="flex justify-center lg:justify-start">
            <div className="max-w-[520px] w-full">
              <HeroLeft />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center lg:justify-end mt-10 lg:mt-0">
            <HeroRight />
          </div>

        </div>
      </div>

      {/* BOTTOM FADE */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-[#0a0a0f]" />
    </motion.section>
  );
}