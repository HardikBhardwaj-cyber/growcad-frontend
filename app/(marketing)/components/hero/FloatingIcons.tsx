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
          className="absolute text-white/5 text-4xl"
          style={{
            top: `${10 + i * 15}%`,
            left: `${10 + i * 20}%`,
          }}
        >
          {icon}
        </motion.div>
      ))}
    </>
  );
}