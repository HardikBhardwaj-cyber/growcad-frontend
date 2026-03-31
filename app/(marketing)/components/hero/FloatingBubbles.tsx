"use client";

import { motion } from "framer-motion";

export default function FloatingBubbles() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -40, 0] }}
          transition={{ repeat: Infinity, duration: 6 + i }}
          className="absolute w-3 h-3 bg-purple-500/30 rounded-full blur-xl"
          style={{
            top: `${20 + i * 10}%`,
            left: `${10 + i * 15}%`,
          }}
        />
      ))}
    </>
  );
}