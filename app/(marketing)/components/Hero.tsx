"use client";

import { motion, Variants } from "framer-motion";
import DashboardPreview from "./hero/DashboardPreview";
import Spotlight from "./hero/Spotlight";
import TypingText from "./hero/TypingText";
import MagneticButton from "./hero/MagneticButton";
import FloatingIcons from "./hero/FloatingIcons";

/* 🔥 VARIANTS */
const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.4,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">

      {/* CURSOR GLOW */}
      <Spotlight />

      {/* GRID */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:30px_30px]" />

      {/* FLOATING ICONS (VISIBLE NOW) */}
      <div className="absolute inset-0 z-0 opacity-60">
        <FloatingIcons />
      </div>

      {/* MAIN */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid lg:grid-cols-2 gap-20 items-center">

        {/* LEFT */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col max-w-lg"
        >

          {/* BADGE */}
          <motion.div variants={item} className="mb-6">
            <div className="relative inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 overflow-hidden">
              <span className="relative z-10">
                🚀 Growth OS for Coaching Institutes
              </span>

              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2.5s_infinite]" />
            </div>
          </motion.div>

          {/* HEADLINE GROUP */}
          <motion.h1
            variants={item}
            className="text-5xl md:text-6xl font-bold leading-tight"
          >
            <span className="text-white block">
              Become the top coaching institute
            </span>

            <span className="text-white block mt-2">
              with
            </span>

            {/* 🔥 PREMIUM GROWCAD */}
            <span className="relative block mt-4 text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-[gradientMove_6s_linear_infinite]">
              GROWCAD

              {/* glow layer */}
              <span className="absolute inset-0 blur-xl opacity-30 bg-gradient-to-r from-purple-500 to-blue-500" />
            </span>
          </motion.h1>

          {/* TYPING */}
          <motion.div variants={item} className="mt-6">
            <TypingText />
          </motion.div>

          {/* SUBTEXT */}
          <motion.p
            variants={item}
            className="text-gray-400 text-lg mt-4 leading-relaxed"
          >
            Run your entire institute on autopilot — from admissions to growth.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={item}
            className="flex gap-4 mt-6"
          >
            <MagneticButton label="Get Started Free" primary />
            <MagneticButton label="See Live Demo" />
          </motion.div>

          {/* TRUST */}
          <motion.div
            variants={item}
            className="flex gap-6 text-sm text-gray-500 mt-6"
          >
            <span>✔ No setup cost</span>
            <span>✔ Multibranch</span>
            <span>✔ Built for scale</span>
          </motion.div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 60 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: "easeOut",
            delay: 0.5,
          }}
          className="relative"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}