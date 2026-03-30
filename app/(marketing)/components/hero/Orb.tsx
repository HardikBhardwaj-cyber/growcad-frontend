"use client";

import { motion } from "framer-motion";

export default function Orb() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

      <motion.div
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 blur-[120px] opacity-30"
      />

      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute w-[250px] h-[250px] rounded-full bg-purple-500/30 blur-[100px]"
      />
    </div>
  );
}