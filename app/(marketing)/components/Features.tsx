"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Smart Attendance",
    desc: "Mark entire class in 1 click. Auto SMS for absentees.",
  },
  {
    title: "Auto Fee System",
    desc: "Collect fees online + offline with auto reminders.",
  },
  {
    title: "AI Teaching System",
    desc: "Generate doubts, tests, and insights instantly.",
  },
];

export default function Features() {
  return (
    <section className="py-20 px-6">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-2xl"
          >
            <h3 className="text-xl font-semibold mb-2">
              {f.title}
            </h3>
            <p className="text-slate-400">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}