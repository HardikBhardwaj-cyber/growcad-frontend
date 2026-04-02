"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../systems/variants";

const trustPoints = [
  {
    title: "Built for Indian Coaching Institutes",
    desc: "Designed specifically for real workflows, not generic software.",
  },
  {
    title: "Multi-Branch Ready",
    desc: "Manage multiple centers from a single powerful dashboard.",
  },
  {
    title: "Secure & Reliable",
    desc: "Your data is safe, encrypted, and always accessible.",
  },
];

export default function TrustPanel() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">

      {/* 🔥 SOFT BACKGROUND GLOW */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative max-w-5xl mx-auto px-6 text-center"
      >

        {/* 🔥 HEADING */}
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-semibold"
        >
          Built with{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400">
            trust & scale
          </span>{" "}
          in mind
        </motion.h2>

        {/* 💎 TRUST GRID */}
        <motion.div
          variants={stagger}
          className="grid md:grid-cols-3 gap-6 mt-12"
        >
          {trustPoints.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="relative p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl"
            >

              {/* 🔥 ICON */}
              <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-linear-to-r from-purple-500 to-blue-500 opacity-80" />

              {/* ✨ TEXT */}
              <h3 className="text-white font-medium">
                {item.title}
              </h3>

              <p className="text-gray-400 text-sm mt-2">
                {item.desc}
              </p>

            </motion.div>
          ))}
        </motion.div>

      </motion.div>
    </section>
  );
}