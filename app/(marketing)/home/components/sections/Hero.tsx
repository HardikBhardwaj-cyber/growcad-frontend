"use client";

import { motion } from "framer-motion";
import Magnetic from "../motion/Magnetic";
import BlobCanvas from "../webgl/BlobCanvas";
import BubbleField from "../webgl/BubbleField";
import Particles from "../webgl/Particles";
import DashboardPreview from "./DashboardPreview";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 -z-10">

        <Particles />
        <BubbleField />
        <BlobCanvas />

        {/* 🔥 LIGHT LAYERS */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(124,58,237,0.35),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_65%,rgba(59,130,246,0.25),transparent_50%)]" />

        {/* 🔥 CENTER FOCUS (IMPORTANT) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]" />

        {/* 🔥 NOISE TEXTURE */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />

      </div>

      {/* 🧠 CONTENT */}
      <div className="max-w-7xl mx-auto px-8 w-full grid md:grid-cols-2 gap-28 items-center">

        {/* LEFT */}
        <div className="space-y-14">

          {/* 🔥 BADGE (NEW - HIGH IMPACT) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-white/70"
          >
            🚀 Growth OS for Coaching Institutes
          </motion.div>

          {/* 🔥 HEADLINE */}
          <motion.h1
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-6xl md:text-7xl font-bold leading-[1.02] tracking-tight"
          >
            Run & Scale <br />
            Your Institute <br />

            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              10x Faster
            </span>
          </motion.h1>

          {/* 🔥 SUBTEXT */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg md:text-xl max-w-xl leading-relaxed"
          >
            Automate admissions, manage students, and scale your coaching
            business with one powerful platform.
          </motion.p>

          {/* 🔥 CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-6"
          >
            <Magnetic>
              <button className="
                btn-primary px-12 py-5 text-lg
                shadow-[0_0_60px_rgba(124,58,237,0.6)]
              ">
                Start Free Trial
              </button>
            </Magnetic>

            <button className="
              btn-secondary px-8 py-4 text-lg
              backdrop-blur-md hover:bg-white/10
            ">
              View Demo
            </button>
          </motion.div>

          {/* 🔥 TRUST LINE */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-white/40"
          >
            Trusted by 500+ institutes • 1L+ students managed
          </motion.div>

        </div>

        {/* RIGHT */}
        <div className="relative flex justify-center">

          {/* 🔥 EXTRA GLOW BEHIND DASHBOARD */}
          <div className="absolute w-[500px] h-[500px] bg-purple-600/30 blur-[150px] opacity-30 -z-10" />

          {/* 🔥 DASHBOARD */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="relative"
          >
            <div className="scale-[1.2] md:scale-[1.35]">
              <DashboardPreview />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}