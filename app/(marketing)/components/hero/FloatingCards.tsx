"use client";

import { motion } from "framer-motion";

export default function FloatingCards() {
  return (
    <>
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute top-20 left-10 bg-white/5 border border-white/10 backdrop-blur-lg p-4 rounded-xl text-white"
      >
        📊 +45% Growth
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 7 }}
        className="absolute bottom-20 right-10 bg-white/5 border border-white/10 backdrop-blur-lg p-4 rounded-xl text-white"
      >
        💰 ₹8.4L Revenue
      </motion.div>
    </>
  );
}