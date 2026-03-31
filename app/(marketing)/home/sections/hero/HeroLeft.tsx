"use client";

import { motion, Variants } from "framer-motion";
import { fadeUp } from "../../systems/variants";

export default function HeroLeft() {
  return (
    <div className="flex flex-col max-w-xl">

      {/* BADGE */}
      <motion.div variants={fadeUp} className="mb-6">
        <div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
          🚀 Growth OS for Coaching Institutes
        </div>
      </motion.div>

      {/* HEADLINE */}
      <motion.h1
        variants={fadeUp}
        className="leading-[1.1]"
      >
        <span className="block text-4xl md:text-5xl text-white font-semibold">
          Beat bigger coaching institutes
        </span>

        <span className="block text-4xl md:text-5xl text-white mt-2">
          with
        </span>

        {/* 🔥 GROWCAD DOMINANCE */}
        <span className="block mt-4 text-7xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 drop-shadow-[0_0_40px_rgba(124,58,237,0.5)]">
          GROWCAD
        </span>
      </motion.h1>

      {/* SUBTEXT */}
      <motion.p
        variants={fadeUp}
        className="text-gray-400 text-lg mt-5 leading-relaxed max-w-md"
      >
        Automate admissions, manage students, and scale your institute — all from one powerful platform.
      </motion.p>

      {/* CTA */}
      <motion.div variants={fadeUp} className="flex gap-4 mt-8">
        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:scale-105 transition">
          Get Early Access
        </button>

        <button className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition">
          Live Demo
        </button>
      </motion.div>

      {/* TRUST */}
      <motion.div
        variants={fadeUp}
        className="flex gap-6 text-sm text-gray-500 mt-6"
      >
        <span>✔ No setup cost</span>
        <span>✔ Multi-branch ready</span>
        <span>✔ Built for scale</span>
      </motion.div>
    </div>
  );
}