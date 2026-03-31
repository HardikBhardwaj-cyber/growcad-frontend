"use client";

import { motion } from "framer-motion";
import MagneticButton from "./hero/MagneticButton";
import DashboardPreview from "./hero/DashboardPreview";
import TypingText from "./hero/TypingText";
import Spotlight from "./hero/Spotlight";
import FloatingBubbles from "./hero/FloatingBubbles";
import FloatingIcons from "./hero/FloatingIcons";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-[#0a0a0f] overflow-hidden">

      {/* BACKGROUND */}
      <Spotlight />
      <FloatingBubbles />
      <FloatingIcons />

      {/* MAIN */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <div className="space-y-8 max-w-xl">

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

            <br />

            <span className="block mt-2 text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              GROWCAD
            </span>
          </h1>

          {/* TYPING */}
          <TypingText />

          {/* SUBTEXT */}
          <p className="text-gray-400 text-lg">
            Manage, automate, and grow your institute — all in one system.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-4">
            <MagneticButton label="Get Started" primary />
            <MagneticButton label="See Live Demo" />
          </div>

          {/* WHATSAPP */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl text-white font-medium w-fit"
          >
            💬 Chat on WhatsApp
          </motion.button>

          {/* TRUST */}
          <div className="flex gap-6 text-sm text-gray-500">
            <span>✔ No setup cost</span>
            <span>✔ Multi-branch ready</span>
            <span>✔ Built for scale</span>
          </div>
        </div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}