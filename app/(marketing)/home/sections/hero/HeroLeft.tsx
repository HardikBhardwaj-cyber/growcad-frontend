"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../../systems/variants";
import MagneticButton from "../../components/ui/MagneticButton";
import { Sparkles } from "lucide-react";

export default function HeroLeft() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col max-w-[640px] text-center lg:text-left"
    >
      {/* 🚀 BADGE */}
      <motion.div
        variants={fadeUp}
        className="mb-6 flex justify-center lg:justify-start"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
        bg-white/5 border border-white/10 text-sm text-gray-300 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span> Growth OS for Coaching Institutes  </span>
        </div>
      </motion.div>

      {/* 🔥 HEADLINE */}
      <motion.h1
        variants={fadeUp}
        className="leading-[1.05] tracking-tight"
      >
        {/* LINE 1 */}
        <span className="block text-4xl sm:text-5xl md:text-6xl font-semibold text-white">
          Become a top coaching institute
        </span>

        {/* LINE 2 (SOFT EMPHASIS) */}
        <span className="block text-4xl sm:text-5xl md:text-6xl font-semibold text-white/80">
          with
        </span>

        {/* 💎 BRAND */}
        <span
          className="block mt-6 text-5xl sm:text-6xl md:text-7xl lg:text-[88px] 
          font-extrabold leading-[0.95] tracking-tight
          bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-500 
          bg-clip-text text-transparent"
        >
          GROWCAD
        </span>
      </motion.h1>

      {/* ✨ SUBTEXT */}
      <motion.p
        variants={fadeUp}
        className="text-gray-400 mt-6 text-lg leading-relaxed max-w-[480px]"
      >
        Admissions, students, fees — everything in one platform.
      </motion.p>

      {/* 🎯 CTA */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start"
      >
        {/* PRIMARY */}
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-purple-500/40 opacity-60 rounded-xl" />

          <MagneticButton className="relative z-10 px-8 py-3 text-base font-semibold">
            Get Early Access
          </MagneticButton>
        </div>

        {/* SECONDARY */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl border border-white/20 text-white 
          hover:bg-white/10 transition backdrop-blur-md"
        >
          See Live Demo
        </motion.button>
      </motion.div>
    </motion.div>
  );
}