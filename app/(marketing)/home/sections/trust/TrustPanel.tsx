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
    <section className="relative py-20">

      <div className="max-w-5xl mx-auto px-6 text-center">

        {/* HEADING */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-3xl md:text-4xl font-semibold"
        >
          Built with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            trust & scale
          </span>{" "}
          in mind
        </motion.h2>

        {/* POINTS */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          className="grid md:grid-cols-3 gap-6 mt-12"
        >
          {trustPoints.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="p-5 rounded-xl bg-white/5 border border-white/10"
            >
              {/* ICON */}
              <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-80" />

              <h3 className="text-white font-medium">
                {item.title}
              </h3>

              <p className="text-gray-400 text-sm mt-2">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}