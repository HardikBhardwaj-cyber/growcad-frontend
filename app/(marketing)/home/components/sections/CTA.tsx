"use client";

import Magnetic from "../motion/Magnetic";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="py-32 relative overflow-hidden">

      {/* 🔥 BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.25),transparent_60%)]" />

      {/* 🔥 GLOW BLOBS */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/30 blur-[120px] opacity-40 -z-10" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/30 blur-[120px] opacity-40 -z-10" />

      <div className="max-w-4xl mx-auto px-6 text-center space-y-10">

        {/* 🔥 HEADLINE */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold leading-tight"
        >
          Stop Managing.
          <br />
          Start Scaling 🚀
        </motion.h2>

        {/* 🔥 SUBTEXT */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/60 text-lg max-w-2xl mx-auto"
        >
          Automate admissions, fees, communication, and growth — 
          all from one powerful platform built for coaching institutes.
        </motion.p>

        {/* 🔥 CTA BUTTONS (DUAL) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* PRIMARY */}
          <Magnetic>
            <button className="
              px-10 py-4 text-lg font-semibold
              btn-primary
              shadow-[0_0_50px_rgba(124,58,237,0.6)]
            ">
              Start Free Trial
            </button>
          </Magnetic>

          {/* SECONDARY */}
          <button className="
            px-8 py-4 text-lg
            border border-white/20 rounded-lg
            text-white/80 hover:bg-white/10 transition
          ">
            Book Demo
          </button>
        </motion.div>

        {/* 🔥 TRUST + URGENCY */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-2"
        >
          <p className="text-white/40 text-sm">
            No credit card required • Setup in minutes
          </p>

          <p className="text-purple-400 text-sm">
            🔥 Limited onboarding slots this month
          </p>
        </motion.div>

      </div>
    </section>
  );
}