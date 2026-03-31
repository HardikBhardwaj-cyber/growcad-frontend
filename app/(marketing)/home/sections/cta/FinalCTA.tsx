"use client";

import { motion } from "framer-motion";
import { fadeUp } from "../../systems/variants";
import EmailCapture from "../coming-soon/EmailCapture";

export default function FinalCTA() {
  return (
    <section className="relative py-24 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-[500px] h-[500px] bg-purple-600/20 blur-[140px] rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">

        {/* HEADLINE */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-4xl md:text-5xl font-bold"
        >
          Be among the first to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            scale with GROWCAD
          </span>
        </motion.h2>

        {/* SUBTEXT */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-gray-400 mt-4 text-lg"
        >
          Join early access and transform how your coaching institute grows.
        </motion.p>

        {/* EMAIL CAPTURE */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="flex justify-center"
        >
          <EmailCapture />
        </motion.div>

        {/* MICRO TRUST */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-gray-500 text-sm mt-4"
        >
          Limited early access. No spam.
        </motion.p>

      </div>
    </section>
  );
}