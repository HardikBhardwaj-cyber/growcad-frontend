"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ReactNode } from "react";

export default function Splash({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">

        {loading && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black overflow-hidden"
          >

            {/* 🔥 BACKGROUND GLOW */}
            <div className="absolute w-[500px] h-[500px] bg-purple-600/30 blur-[140px] opacity-40" />
            <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] opacity-30" />

            {/* 🔥 CENTER LIGHT */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]" />

            {/* 🔥 LOGO / TEXT */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.9, 1.05, 1],
                opacity: 1,
              }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
              }}
              className="relative z-10 text-center"
            >

              {/* 🔥 BRAND */}
              <motion.h1
                className="text-4xl md:text-5xl font-bold tracking-wide gradient-text"
              >
                GROWCAD
              </motion.h1>

              {/* 🔥 TAGLINE */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.6, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-white/60 mt-2"
              >
                Growth OS for Institutes
              </motion.p>

            </motion.div>

            {/* 🔥 LOADING BAR */}
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500"
            />

          </motion.div>
        )}

      </AnimatePresence>

      {/* 🔥 PAGE REVEAL */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}