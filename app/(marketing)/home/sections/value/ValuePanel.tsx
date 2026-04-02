"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../systems/variants";

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

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-[700px] h-[700px] bg-purple-600/10 blur-[140px] rounded-full" />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative max-w-6xl mx-auto px-6 text-center"
      >

        {/* 🔥 HEADING */}
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl md:text-5xl font-bold"
        >
          Everything your institute needs to{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400">
            grow faster
          </span>
        </motion.h2>

        {/* ✨ SUBTEXT */}
        <motion.p
          variants={fadeUp}
          className="text-gray-400 mt-4 text-base sm:text-lg max-w-2xl mx-auto"
        >
          Replace multiple tools with one powerful system designed for coaching institutes.
        </motion.p>

        {/* 💎 CARDS */}
        <motion.div
          variants={stagger}
          className="grid md:grid-cols-3 gap-6 mt-14"
        >
          {features.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl transition"
            >

              {/* 🔥 HOVER GLOW */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                <div className="absolute inset-0 bg-purple-500/10 blur-2xl rounded-2xl" />
              </div>

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