"use client";

import { motion } from "framer-motion";
import { fadeUp } from "../../systems/variants";

export default function HeroLeft() {
  return (
    <div className="flex flex-col max-w-xl">

      {/* BADGE */}
      <motion.div variants={fadeUp} className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 backdrop-blur-md">
          🚀 Growth OS for Coaching Institutes
        </div>
      </motion.div>

      {/* HEADLINE */}
      <motion.h1 variants={fadeUp} className="leading-[1.05]">

        <span className="block text-3xl sm:text-4xl md:text-5xl font-semibold">
          Beat bigger coaching institutes
        </span>

        <span className="block mt-2 text-3xl sm:text-4xl md:text-5xl">
          with
        </span>

        {/* 🔥 MAIN BRAND */}
        <span className="block mt-4 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 drop-shadow-[0_0_50px_rgba(124,58,237,0.6)]">
          GROWCAD
        </span>
      </motion.h1>

      {/* SUBTEXT */}
      <motion.p
        variants={fadeUp}
        className="text-gray-400 text-base sm:text-lg mt-5 leading-relaxed max-w-md"
      >
        Automate admissions, manage students, and scale your institute —
        all from one powerful platform.
      </motion.p>

      {/* CTA */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row gap-4 mt-8"
      >
        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 transition">
          Get Early Access
        </button>

        <button className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition">
          Live Demo
        </button>
      </motion.div>

      {/* TRUST */}
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap gap-4 text-sm text-gray-500 mt-6"
      >
        <span>✔ No setup cost</span>
        <span>✔ Multi-branch ready</span>
        <span>✔ Built for scale</span>
      </motion.div>
    </div>
  );
}