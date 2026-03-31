"use client";

import { motion, Variants } from "framer-motion";
import DashboardPreview from "./hero/DashboardPreview";
import Spotlight from "./hero/Spotlight";
import TypingText from "./hero/TypingText";
import MagneticButton from "./hero/MagneticButton";
import FloatingIcons from "./hero/FloatingIcons";

/* 🔥 ANIMATION VARIANTS */
const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4, // smooth after splash
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">

      {/* 🌌 CURSOR GLOW */}
      <Spotlight />

      {/* 🌐 GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:30px_30px]" />

      {/* 🎯 FLOATING ICONS */}
      <FloatingIcons />

      {/* MAIN CONTAINER */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-12 lg:px-20 grid lg:grid-cols-2 gap-24 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-10 max-w-xl"
        >
          {/* BADGE */}
          <motion.div variants={item}>
            <div className="relative inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 overflow-hidden">
              <span className="relative z-10">
                🚀 Growth OS for Coaching Institutes
              </span>

              {/* shimmer */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
            </div>
          </motion.div>

          {/* HEADLINE */}
          <motion.h1
            variants={item}
            className="text-5xl md:text-6xl font-bold leading-tight"
          >
            <span className="text-white">
              Become the top coaching institute with
            </span>

            <span className="block mt-3 text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              GROWCAD
            </span>
          </motion.h1>

          {/* TYPING TEXT */}
          <motion.div variants={item}>
            <TypingText />
          </motion.div>

          {/* SUBTEXT */}
          <motion.p
            variants={item}
            className="text-gray-400 text-lg leading-relaxed"
          >
            Run your entire institute on autopilot — from admissions to growth.
          </motion.p>

          {/* CTA BUTTONS */}
          <motion.div
            variants={item}
            className="flex flex-wrap gap-4"
          >
            <MagneticButton label="Get Started Free" primary />
            <MagneticButton label="See Live Demo" />
          </motion.div>

          {/* TRUST LINE */}
          <motion.div
            variants={item}
            className="flex flex-wrap gap-6 text-sm text-gray-500"
          >
            <span>✔ No setup cost</span>
            <span>✔ Multibranch</span>
            <span>✔ Built for scale</span>
          </motion.div>
        </motion.div>

        {/* RIGHT DASHBOARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 60 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
            delay: 0.6, // enters after left content
          }}
          className="relative"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}