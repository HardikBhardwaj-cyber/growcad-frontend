"use client";

import { motion } from "framer-motion";
import MagneticButton from "./hero/MagneticButton";
import TypingText from "./hero/TypingText";
import Spotlight from "./hero/Spotlight";
import DashboardPreview from "./hero/DashboardPreview";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] overflow-hidden text-center">

      {/* BACKGROUND */}
      <Spotlight />

      {/* CENTER CONTENT */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 flex flex-col items-center space-y-8">

        {/* BADGE */}
        <div className="relative inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 overflow-hidden">
          <span className="relative z-10">
            🚀 Growth OS for Coaching Institutes
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
        </div>

        {/* HEADLINE */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
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
        <p className="text-gray-400 text-lg max-w-xl">
          Run your entire institute on autopilot — from admissions to growth.
        </p>

        {/* CTA */}
        <div className="flex gap-4 flex-wrap justify-center">
          <MagneticButton label="Get Started" primary />
          <MagneticButton label="See Live Demo" />
        </div>

        {/* TRUST */}
        <div className="flex gap-6 text-sm text-gray-500 flex-wrap justify-center">
          <span>✔ No setup cost</span>
          <span>✔ Multi-branch ready</span>
          <span>✔ Built for scale</span>
        </div>
      </div>

      {/* FLOATING DASHBOARD (BELOW + OVERLAPPING) */}
      <div className="relative mt-20 w-full flex justify-center">
        <div className="w-[90%] max-w-5xl">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}