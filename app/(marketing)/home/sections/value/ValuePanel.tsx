"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../../systems/variants";

const features = [
  {
    title: "Automate Admissions",
    desc: "Capture leads, manage enquiries, and convert students automatically.",
  },
  {
    title: "Manage Everything",
    desc: "Students, fees, batches, and faculty — all in one place.",
  },
  {
    title: "Scale Multi-Branch",
    desc: "Run and grow multiple branches with full control and insights.",
  },
];

export default function ValuePanel() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">

      {/* 🔥 BACKGROUND DEPTH */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-[800px] h-[800px] bg-purple-600/10 blur-[160px] rounded-full" />
        <div className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full" />
      </div>

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
          className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight"
        >
          Everything your institute needs to{" "}
          <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-blue-400 to-purple-400">
            grow faster

            {/* glow */}
            <span className="absolute inset-0 blur-xl opacity-30 bg-gradient-to-r from-purple-500 to-blue-500" />
          </span>
        </motion.h2>

        {/* ✨ SUBTEXT */}
        <motion.p
          variants={fadeUp}
          className="text-gray-400 mt-5 text-base sm:text-lg max-w-2xl mx-auto"
        >
          Replace multiple tools with one powerful system designed specifically
          for coaching institutes.
        </motion.p>

        {/* 💎 CARDS */}
        <motion.div
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 mt-16"
        >
          {features.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="group relative p-7 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(124,58,237,0.1)]"
            >

              {/* 🔥 HOVER GLOW */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                <div className="absolute inset-0 bg-purple-500/10 blur-2xl rounded-2xl" />
              </div>

              {/* 🔥 ICON */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="w-12 h-12 mx-auto mb-5 rounded-xl bg-linear-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_25px_rgba(124,58,237,0.4)]"
              />

              {/* ✨ CONTENT */}
              <div className="relative z-10">
                <h3 className="text-white text-lg font-semibold">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                  {item.desc}
                </p>
              </div>

            </motion.div>
          ))}
        </motion.div>

      </motion.div>
    </section>
  );
}