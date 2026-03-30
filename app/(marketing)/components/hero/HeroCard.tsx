"use client";

import { motion } from "framer-motion";
import TypingText from "./TypingText";
import MagneticButton from "./MagneticButton";

export default function HeroCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="
        relative
        backdrop-blur-xl
        bg-white/5
        border border-white/10
        rounded-2xl
        px-6 py-8 md:px-10 md:py-12
        shadow-[0_0_80px_rgba(124,58,237,0.25)]
        max-w-4xl
        mx-auto
      "
    >
      {/* 🔥 Glow Border */}
      <div className="absolute inset-0 rounded-2xl border border-purple-500/20 pointer-events-none" />

      {/* 🧠 HEADLINE */}
      <h1 className="text-3xl md:text-6xl font-bold leading-tight">
        Run Your Institute Like a{" "}
        <TypingText />
      </h1>

      {/* ✨ SUBTEXT */}
      <p className="text-gray-400 mt-4 md:mt-6 text-sm md:text-lg max-w-2xl mx-auto">
        Automate attendance, fees, tests, and growth — all in one platform.
      </p>

      {/* 🎯 CTA */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mt-6 md:mt-8">

        <MagneticButton>
          Start Free — No Setup Needed
        </MagneticButton>

        <button className="btn-secondary">
          See How It Works
        </button>

      </div>

      {/* 💎 MICRO TRUST */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        Trusted by 500+ institutes • 10K+ students
      </p>

    </motion.div>
  );
}