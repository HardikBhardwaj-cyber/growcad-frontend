"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../systems/variants";
import EmailCapture from "./EmailCapture";

export default function ComingSoon() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">

      {/* 🔥 BACKGROUND LIGHT */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-[600px] h-[600px] bg-purple-600/20 blur-[140px] rounded-full" />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto px-6 text-center"
      >

        {/* 🚀 BADGE */}
        <motion.div variants={fadeUp} className="mb-6">
          <span className="inline-flex px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 backdrop-blur-md">
            🚀 Launching Soon
          </span>
        </motion.div>

        {/* 🔥 HEADLINE */}
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
        >
          Be the first to experience{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400">
            GROWCAD
          </span>
        </motion.h2>

        {/* ✨ SUBTEXT */}
        <motion.p
          variants={fadeUp}
          className="text-gray-400 mt-4 text-base sm:text-lg"
        >
          We’re building the ultimate Growth OS for coaching institutes.
          Join early access and scale faster than ever.
        </motion.p>

        {/* 💎 EMAIL */}
        <motion.div variants={fadeUp} className="mt-8 flex justify-center">
          <EmailCapture />
        </motion.div>

        {/* 🔐 TRUST */}
        <motion.p
          variants={fadeUp}
          className="text-gray-500 text-sm mt-4"
        >
          No spam. Early access only.
        </motion.p>

      </motion.div>
    </section>
  );
}