"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../../systems/variants";
import EmailCapture from "../coming-soon/EmailCapture";

export default function FinalCTA() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">

      {/* 🔥 BACKGROUND GLOW SYSTEM */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[800px] h-[800px] bg-purple-600/20 blur-[180px] rounded-full" />
        <div className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full" />
      </div>

      {/* 🔥 FLOATING PARTICLE */}
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute right-20 top-20 w-4 h-4 bg-purple-400 rounded-full blur-sm opacity-60"
      />

      {/* 🔥 MAIN */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative max-w-5xl mx-auto px-6 text-center"
      >

        {/* 🔥 HEADLINE */}
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight"
        >
          Ready to{" "}
          <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-blue-400 to-purple-400 animate-[gradientMove_6s_linear_infinite]">
            scale your institute

            {/* glow layer */}
            <span className="absolute inset-0 blur-xl opacity-30 bg-gradient-to-r from-purple-500 to-blue-500" />
          </span>{" "}
          with GROWCAD?
        </motion.h2>

        {/* ✨ SUBTEXT */}
        <motion.p
          variants={fadeUp}
          className="text-gray-400 mt-6 text-base sm:text-lg max-w-2xl mx-auto"
        >
          Join early access and experience the future of coaching management.
        </motion.p>

        {/* 💎 CTA CARD */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex justify-center"
        >
          <div className="w-full max-w-md p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_60px_rgba(124,58,237,0.2)]">
            <EmailCapture />
          </div>
        </motion.div>

        {/* 🔐 TRUST */}
        <motion.p
          variants={fadeUp}
          className="text-gray-500 text-sm mt-4"
        >
          Limited early access. No spam. Cancel anytime.
        </motion.p>

      </motion.div>
    </section>
  );
}