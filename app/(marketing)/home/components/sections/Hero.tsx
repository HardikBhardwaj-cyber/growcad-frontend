"use client";

import { motion } from "framer-motion";
import Magnetic from "../motion/Magnetic";
import BlobCanvas from "../webgl/BlobCanvas";
import BubbleField from "../webgl/BubbleField";
import Particles from "../webgl/Particles";
import DashboardPreview from "./DashboardPreview";

const APP_URL = "https://app.growcad.in";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Particles />
        <BubbleField />
        <BlobCanvas />

        {/* LIGHT LAYERS */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(124,58,237,0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_65%,rgba(59,130,246,0.25),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_65%)]" />

        {/* NOISE */}
        <div className="absolute inset-0 opacity-[0.025] bg-[url('/noise.png')]" />
      </div>

      {/* 🧠 CONTENT */}
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-20 items-center">

        {/* LEFT */}
        <div className="max-w-xl space-y-12">

          {/* 🔥 BADGE */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-white/70"
          >
            🚀 Growth OS for Coaching Institutes
          </motion.div>

          {/* 🔥 HEADLINE */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight"
          >
            Run & Scale <br />
            Your Institute <br />

            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              10x Faster
            </span>
          </motion.h1>

          {/* 🔥 SUBTEXT */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg md:text-xl leading-relaxed"
          >
            Automate admissions, manage students, and scale your coaching
            business — all from one powerful platform.
          </motion.p>

          {/* 🔥 CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap items-center gap-4"
          >
            {/* PRIMARY CTA */}
            <Magnetic>
              <a
                href={`${APP_URL}/signup`}
                className="btn-primary px-10 py-4 text-lg shadow-[0_0_50px_rgba(124,58,237,0.5)]"
              >
                Start Free Trial
              </a>
            </Magnetic>

            {/* SECONDARY */}
            <a
              href="#demo"
              className="btn-secondary px-6 py-3 text-lg backdrop-blur-md hover:bg-white/10"
            >
              View Demo
            </a>

            {/* LOGIN (IMPORTANT 🔥) */}
            <a
              href={`${APP_URL}/login`}
              className="text-sm text-white/60 hover:text-white transition"
            >
              Already using Growcad? Login →
            </a>
          </motion.div>

          {/* 🔥 TRUST */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-white/40"
          >
            Trusted by 500+ institutes • 1L+ students managed
          </motion.div>

        </div>

        {/* RIGHT */}
        <div className="relative flex justify-center items-center">

          {/* 🔥 GLOW */}
          <div className="absolute w-[500px] h-[500px] bg-purple-600/30 blur-[160px] opacity-30 -z-10" />

          {/* 🔥 DASHBOARD */}
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3 }}
            className="w-full max-w-[540px]"
          >
            <DashboardPreview />
          </motion.div>

        </div>

      </div>
    </section>
  );
}