"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../../systems/variants";
import EmailCapture from "./EmailCapture";

export default function ComingSoon() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">

      {/* 🔥 BACKGROUND GLOW SYSTEM */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-[700px] h-[700px] bg-purple-600/20 blur-[160px] rounded-full" />
        <div className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full" />
      </div>

      {/* 🔥 FLOATING ORB */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-10 w-6 h-6 bg-purple-500 rounded-full blur-sm opacity-60"
      />

      {/* 🔥 MAIN CONTENT */}
      <motion.div
        variants={staggerContainer}
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
          className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight"
        >
          Be the first to experience{" "}
          <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-blue-400 to-purple-400 animate-[gradientMove_6s_linear_infinite]">
            GROWCAD

            {/* 🔥 GLOW */}
            <span className="absolute inset-0 blur-xl opacity-30 bg-gradient-to-r from-purple-500 to-blue-500" />
          </span>
        </motion.h2>

        {/* ✨ SUBTEXT */}
        <motion.p
          variants={fadeUp}
          className="text-gray-400 mt-6 text-base sm:text-lg max-w-2xl mx-auto"
        >
          We’re building the ultimate Growth OS for coaching institutes.
          Join early access and scale faster than ever.
        </motion.p>

        {/* 💎 EMAIL CARD */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex justify-center"
        >
          <div className="w-full max-w-md p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(124,58,237,0.15)]">
            <EmailCapture />
          </div>
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