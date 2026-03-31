"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashIntro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.8, duration: 0.6 }}
      className="fixed inset-0 z-[9999] bg-[#0a0a0f] flex items-center justify-center"
    >
      <div className="flex items-center gap-3">

        {/* LINE */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 120 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-[2px] bg-gradient-to-r from-purple-500 to-blue-500"
        />

        {/* DOT */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_20px_#a855f7]"
        />

        {/* BRAND */}
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="text-white font-semibold tracking-wide"
        >
          GROWCAD
        </motion.span>
      </div>
    </motion.div>
  );
}