"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../systems/variants";

const values = [
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
    <section className="relative py-24">

      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* HEADING */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-4xl md:text-5xl font-bold"
        >
          Everything your institute needs to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            grow faster
          </span>
        </motion.h2>

        {/* SUBTEXT */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto"
        >
          Replace multiple tools with one powerful system designed for coaching institutes.
        </motion.p>

        {/* CARDS */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          className="grid md:grid-cols-3 gap-6 mt-14"
        >
          {values.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-purple-400/40 transition group"
            >
              {/* GLOW ON HOVER */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                <div className="absolute inset-0 bg-purple-500/10 blur-2xl rounded-2xl" />
              </div>

              {/* CONTENT */}
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="text-gray-400 mt-3 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}