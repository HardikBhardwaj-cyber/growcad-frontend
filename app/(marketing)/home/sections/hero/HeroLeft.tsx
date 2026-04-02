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
      className="flex flex-col max-w-xl text-center lg:text-left pl-2 lg:pl-6"
    >

      {/* 🚀 BADGE */}
      <motion.div variants={fadeUp} className="mb-6 flex justify-center lg:justify-start">
        <div className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 backdrop-blur-md hover:bg-white/10 transition">

          <Sparkles className="w-4 h-4 text-purple-400" />

          <span>Growth OS for Coaching Institutes</span>

        </div>
      </motion.div>

      {/* 🔥 HEADLINE */}
      <motion.h1 variants={fadeUp} className="leading-[1.05]">

        <span className="block text-3xl sm:text-4xl md:text-5xl font-medium text-white">
          Beat bigger coaching institutes
        </span>

        <span className="block mt-2 text-3xl sm:text-4xl md:text-5xl text-white">
          with
        </span>

        {/* 💎 GROWCAD */}
        <motion.span
          className="relative block mt-4 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-blue-400 to-purple-400"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%"],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ backgroundSize: "200% 200%" }}
        >
          GROWCAD

          {/* 🔥 SOFT GLOW */}
          <span className="absolute inset-0 blur-2xl opacity-25 bg-gradient-to-r from-purple-500 to-blue-500" />
        </motion.span>

      </motion.h1>

      {/* ✨ SUBTEXT */}
      <motion.p
        variants={fadeUp}
        className="text-gray-400 mt-6 text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0"
      >
        Automate admissions, manage students, and scale your institute —
        all from one powerful platform.
      </motion.p>

      {/* 🎯 CTA */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start"
      >

        {/* 🔥 PRIMARY CTA */}
        <div className="relative">

          {/* glow layer */}
          <div className="absolute inset-0 blur-xl bg-purple-500/30 opacity-40 rounded-xl animate-pulse" />

          <MagneticButton className="relative z-10">
            Get Early Access
          </MagneticButton>

        </div>

        {/* 🔥 SECONDARY */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition backdrop-blur-md"
        >
          See Live Demo
        </motion.button>

      </motion.div>

      {/* ✅ TRUST STRIP */}
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-500 mt-8"
      >

        <div className="flex items-center gap-2 hover:text-white transition">
          <CheckCircle2 className="w-4 h-4 text-purple-400" />
          <span>No setup cost</span>
        </div>

        <div className="flex items-center gap-2 hover:text-white transition">
          <CheckCircle2 className="w-4 h-4 text-purple-400" />
          <span>Multi-branch ready</span>
        </div>

        <div className="flex items-center gap-2 hover:text-white transition">
          <CheckCircle2 className="w-4 h-4 text-purple-400" />
          <span>Built for scale</span>
        </div>

      </motion.div>

    </motion.div>
  );
}