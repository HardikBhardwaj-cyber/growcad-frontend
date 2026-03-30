"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Students", value: "10K+" },
  { label: "Institutes", value: "500+" },
  { label: "Growth", value: "32%" },
];

export default function Stats() {
  return (
    <div className="mt-10 flex justify-center gap-8 text-center">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}
        >
          <h3 className="text-2xl font-bold gradient-text">{s.value}</h3>
          <p className="text-gray-400 text-sm">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}