"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../systems/variants";
import MagneticButton from "../../components/ui/MagneticButton";

export default function HeroLeft() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col max-w-xl text-center lg:text-left"
    >

      {/* 🚀 BADGE */}
      <motion.div variants={fadeUp} className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 backdrop-blur-md">
          🚀 Growth OS for Coaching Institutes
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

        {/* 💎 GROWCAD (ANIMATED GRADIENT) */}
        <motion.span
          className="block mt-4 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-blue-400 to-purple-400"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%"],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        >
          GROWCAD
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

        <MagneticButton>
          Get Early Access
        </MagneticButton>

        <button className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition backdrop-blur-md">
          See Live Demo
        </button>

      </motion.div>

      {/* ✅ TRUST STRIP */}
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-gray-500 mt-6"
      >
        <span>✔ No setup cost</span>
        <span>✔ Multi-branch ready</span>
        <span>✔ Built for scale</span>
      </motion.div>

    </motion.div>
  );
}