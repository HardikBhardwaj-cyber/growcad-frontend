"use client";

import { motion } from "framer-motion";
import DashboardPreview from "./hero/DashboardPreview";
import Spotlight from "./hero/Spotlight";
import TypingText from "./hero/TypingText";
import MagneticButton from "./hero/MagneticButton";
import FloatingIcons from "./hero/FloatingIcons";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">

      {/* BACKGROUND GLOW */}
      <Spotlight />

      {/* GRID + PARTICLES */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:30px_30px]" />

      {/* FLOATING ICONS */}
      <FloatingIcons />

      {/* MAIN */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <div className="space-y-8 max-w-xl">

          {/* BADGE */}
          <div className="relative inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 overflow-hidden">
            <span className="relative z-10">
              🚀 Growth OS for Coaching Institutes
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
          </div>

          {/* HEADLINE */}
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            <span className="text-white">
              Become the top coaching institute with
            </span>

            <span className="block mt-3 text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              GROWCAD
            </span>
          </h1>

          {/* TYPING */}
          <TypingText />

          {/* SUBTEXT */}
          <p className="text-gray-400 text-lg">
            Run your entire institute on autopilot — from admissions to growth.
          </p>

          {/* CTA */}
          <div className="flex gap-4">
            <MagneticButton label="Get Started Free" primary />
            <MagneticButton label="See Live Demo" />
          </div>

          {/* TRUST */}
          <div className="flex gap-6 text-sm text-gray-500">
            <span>✔ No setup cost</span>
            <span>✔ Multibranch</span>
            <span>✔ Built for scale</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}