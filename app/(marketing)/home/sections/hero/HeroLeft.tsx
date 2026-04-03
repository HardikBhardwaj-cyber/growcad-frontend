"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../../systems/variants";
import MagneticButton from "../../components/ui/MagneticButton";
import { Sparkles, CheckCircle2 } from "lucide-react";

export default function HeroLeft() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col max-w-[600px] text-center lg:text-left pr-4 lg:pr-0"
    >
      {/* 🚀 BADGE */}
      <motion.div variants={fadeUp} className="mb-8 flex justify-center lg:justify-start">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
        bg-white/5 border border-white/10 text-sm text-gray-300 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Growth OS for Coaching Institutes</span>
        </div>
      </motion.div>

      {/* 🔥 HEADLINE */}
      <motion.h1
        variants={fadeUp}
        className="leading-[1.05] tracking-tight"
      >
        <span className="block text-4xl sm:text-5xl md:text-6xl font-semibold text-white">
          Beat bigger coaching
        </span>

        <span className="block text-4xl sm:text-5xl md:text-6xl font-semibold text-white">
          institutes
        </span>

        {/* 💎 BRAND */}
        <motion.span
          className="block mt-8 text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] font-extrabold 
          bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-500 
          bg-clip-text text-transparent pl-1
          drop-shadow-[0_12px_40px_rgba(124,58,237,0.45)]"
          animate={{ opacity: [1, 0.92, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          GROWCAD
        </motion.span>
      </motion.h1>

      {/* ✨ SUBTEXT */}
      <motion.p
        variants={fadeUp}
        className="text-gray-300 mt-8 text-lg leading-relaxed max-w-[520px]"
      >
        Automate admissions, track student performance, and manage your entire institute —
        all from one powerful system built to help you scale faster than competitors.
      </motion.p>

      {/* 🎯 CTA */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row gap-4 mt-10 justify-center lg:justify-start items-center lg:items-start"
      >
        {/* PRIMARY CTA */}
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-purple-500/50 opacity-70 rounded-xl" />

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

      {/* 🔥 MICRO PROOF (VERY IMPORTANT) */}
      <motion.div
        variants={fadeUp}
        className="mt-6 text-xs text-gray-500 text-center lg:text-left"
      >
        Used by growing coaching institutes across India
      </motion.div>

      {/* ✅ TRUST */}
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-400 mt-8"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-purple-400" />
          <span>No setup cost</span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-purple-400" />
          <span>Multi-branch ready</span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-purple-400" />
          <span>Built for scale</span>
        </div>
      </motion.div>

      {/* 🔥 URGENCY (SUBCONSCIOUS TRIGGER) */}
      <motion.div
        variants={fadeUp}
        className="mt-4 text-xs text-gray-500 text-center lg:text-left"
      >
        Limited early access • No spam • Cancel anytime
      </motion.div>
    </motion.div>
  );
}