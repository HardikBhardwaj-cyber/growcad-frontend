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
      className="flex flex-col max-w-[580px] text-left"
    >
      {/* BADGE */}
      <motion.div variants={fadeUp} className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
        bg-white/5 border border-white/10 text-xs text-gray-300 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Growth OS for Coaching Institutes
        </div>
      </motion.div>

      {/* HEADLINE */}
      <motion.h1 variants={fadeUp} className="leading-[1.05] tracking-tight">
        <span className="block text-4xl sm:text-5xl md:text-6xl font-semibold text-white">
          Become a top coaching institute with
        </span>

        <span className="block mt-4 text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-extrabold 
        bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-500 
        bg-clip-text text-transparent leading-[0.95]">
          GROWCAD
        </span>
      </motion.h1>

      {/* SUBTEXT */}
      <motion.p
        variants={fadeUp}
        className="text-gray-400 mt-5 text-base leading-relaxed max-w-[460px]"
      >
        Run your entire institute from one powerful system.
      </motion.p>

      {/* CTA (FOCUS FIXED) */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-4 mt-8"
      >
        {/* PRIMARY (STRONG) */}
        <MagneticButton className="px-8 py-3 text-sm font-semibold shadow-[0_0_25px_rgba(124,58,237,0.6)]">
          Get Early Access
        </MagneticButton>

        {/* SECONDARY (WEAKER) */}
        <button
          className="text-sm text-gray-400 hover:text-white transition"
        >
          See Live Demo →
        </button>
      </motion.div>
    </motion.div>
  );
}