"use client";

import { motion } from "framer-motion";
import EmailCapture from "./EmailCapture";
import { fadeUp } from "../../systems/variants";

export default function ComingSoon() {
  return (
    <section className="relative py-24 flex justify-center">

      <div className="max-w-4xl mx-auto px-6 text-center">

        {/* BADGE */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show">
          <span className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
            🚀 Launching Soon
          </span>
        </motion.div>

        {/* HEADLINE */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-4xl md:text-5xl font-bold mt-6"
        >
          Be the first to experience{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            GROWCAD
          </span>
        </motion.h2>

        {/* SUBTEXT */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto"
        >
          We’re building the ultimate Growth OS for coaching institutes.
          Join early access and scale faster than ever.
        </motion.p>

        {/* EMAIL */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
        >
          <EmailCapture />
        </motion.div>

        {/* TRUST MICRO COPY */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-gray-500 text-sm mt-4"
        >
          No spam. Early access only.
        </motion.p>

      </div>
    </section>
  );
}