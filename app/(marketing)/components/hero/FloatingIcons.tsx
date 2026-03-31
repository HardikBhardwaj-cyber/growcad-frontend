"use client";

import { motion } from "framer-motion";

const icons = ["∫", "π", "√", "Δ", "Σ"];

export default function FloatingIcons() {
  return (
    <>
      {icons.map((icon, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, 40, 0] }}
          transition={{ repeat: Infinity, duration: 6 + i }}
          className="absolute text-white/10 text-3xl"
          style={{
            top: `${20 + i * 10}%`,
            left: `${70 + (i % 2) * 10}%`,
          }}
        >
          {icon}
        </motion.div>
      ))}
    </>
  );
}