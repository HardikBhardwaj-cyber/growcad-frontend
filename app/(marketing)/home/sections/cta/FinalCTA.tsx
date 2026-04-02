"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../systems/variants";
import EmailCapture from "../coming-soon/EmailCapture";

export default function FinalCTA() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">

      {/* 🔥 STRONG GLOW BACKGROUND */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-[700px] h-[700px] bg-purple-600/20 blur-[160px] rounded-full" />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto px-6 text-center"
      >

        {/* 🔥 HEADLINE */}
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
        >
          Ready to{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-blue-400 to-purple-400">
            scale your institute
          </span>{" "}
          with GROWCAD?
        </motion.h2>

        {/* ✨ SUBTEXT */}
        <motion.p
          variants={fadeUp}
          className="text-gray-400 mt-4 text-base sm:text-lg"
        >
          Join early access and experience the future of coaching management.
        </motion.p>

        {/* 💎 EMAIL CAPTURE */}
        <motion.div
          variants={fadeUp}
          className="flex justify-center mt-8"
        >
          <EmailCapture />
        </motion.div>

        {/* 🔐 TRUST MICRO */}
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