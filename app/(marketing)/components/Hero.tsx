"use client";

import { motion, Variants } from "framer-motion";
import DashboardPreview from "./hero/DashboardPreview";
import Spotlight from "./hero/Spotlight";
import TypingText from "./hero/TypingText";
import MagneticButton from "./hero/MagneticButton";
import FloatingIcons from "./hero/FloatingIcons";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.5,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0f]">

      <Spotlight />

      {/* DEPTH GRID */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* FLOATING ICONS */}
      <div className="absolute inset-0 z-0 opacity-70">
        <FloatingIcons />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">

        {/* LEFT */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col max-w-xl"
        >
          {/* BADGE */}
          <motion.div variants={item} className="mb-6">
            <div className="relative inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 overflow-hidden backdrop-blur-md">
              🚀 Growth OS for Coaching Institutes
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite]" />
            </div>
          </motion.div>

          {/* HEADLINE */}
          <motion.h1
            variants={item}
            className="leading-[1.1]"
          >
            <span className="block text-4xl md:text-5xl text-white font-semibold">
              Beat bigger coaching institutes
            </span>

            <span className="block text-4xl md:text-5xl text-white mt-2">
              with
            </span>

            {/* 🔥 BRAND DOMINANCE */}
            <span className="relative block mt-4 text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-[gradientMove_6s_linear_infinite]">
              GROWCAD

              <span className="absolute inset-0 blur-2xl opacity-40 bg-gradient-to-r from-purple-600 to-blue-600" />
            </span>
          </motion.h1>

          {/* TYPING */}
          <motion.div variants={item} className="mt-6">
            <TypingText />
          </motion.div>

          {/* SUBTEXT */}
          <motion.p
            variants={item}
            className="text-gray-400 text-lg mt-5 leading-relaxed max-w-md"
          >
            Automate admissions, manage students, and scale your institute — all from one powerful platform.
          </motion.p>

          {/* CTA */}
          <motion.div variants={item} className="flex gap-4 mt-8">
            <MagneticButton label="Start Free Trial" primary />
            <MagneticButton label="Live Demo" />
          </motion.div>

          {/* TRUST */}
          <motion.div
            variants={item}
            className="flex gap-6 text-sm text-gray-500 mt-6"
          >
            <span>✔ No setup cost</span>
            <span>✔ Works for 1–100 branches</span>
            <span>✔ Scale-ready infra</span>
          </motion.div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 80 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.6,
          }}
          className="relative flex justify-end"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}