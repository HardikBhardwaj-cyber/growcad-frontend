"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../../systems/variants";

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
    <section className="relative py-28 md:py-36 overflow-hidden">

      {/* 🔥 BACKGROUND LAYERS */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-[700px] h-[700px] bg-blue-500/10 blur-[140px] rounded-full" />
        <div className="absolute w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* 🔥 MAIN */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative max-w-6xl mx-auto px-6 text-center"
      >

        {/* 🔥 HEADING */}
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-5xl font-semibold leading-tight"
        >
          Built with{" "}
          <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400">
            trust & scale

            {/* glow */}
            <span className="absolute inset-0 blur-xl opacity-30 bg-gradient-to-r from-purple-500 to-blue-500" />
          </span>{" "}
          in mind
        </motion.h2>

        {/* ✨ SUBTEXT */}
        <motion.p
          variants={fadeUp}
          className="text-gray-400 mt-4 max-w-xl mx-auto"
        >
          Everything is designed to help coaching institutes grow faster,
          operate smarter, and scale without limits.
        </motion.p>

        {/* 💎 TRUST GRID */}
        <motion.div
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 mt-14"
        >
          {trustPoints.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(124,58,237,0.1)]"
            >

              {/* 🔥 ICON WITH GLOW */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="w-12 h-12 mx-auto mb-5 rounded-full bg-linear-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_25px_rgba(124,58,237,0.4)]"
              />

              {/* ✨ TITLE */}
              <h3 className="text-white font-semibold text-lg">
                {item.title}
              </h3>

              {/* ✨ DESC */}
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                {item.desc}
              </p>

            </motion.div>
          ))}
        </motion.div>

      </motion.div>
    </section>
  );
}