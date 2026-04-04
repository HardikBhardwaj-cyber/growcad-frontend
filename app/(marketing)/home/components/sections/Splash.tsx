"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, ReactNode } from "react";

export default function Splash({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050507] overflow-hidden"
          >

            {/* 🔥 BACKGROUND ENERGY BLOBS */}
            <div className="absolute w-[600px] h-[600px] bg-purple-600/30 blur-[160px] opacity-40" />
            <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[140px] opacity-30" />

            {/* 🔥 CENTER LIGHT */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]" />

            {/* 🔥 NOISE TEXTURE */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />

            {/* 🔥 MAIN CONTENT */}
            <div className="relative z-10 flex flex-col items-center">

              {/* 🔥 LOGO TEXT */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.8, letterSpacing: "0.2em" }}
                animate={{
                  opacity: 1,
                  scale: [0.9, 1.05, 1],
                  letterSpacing: ["0.2em", "0.05em"],
                }}
                transition={{
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1], // premium easing
                }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient"
              >
                GROWCAD
              </motion.h1>

              {/* 🔥 TAGLINE */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.6, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-white/60 text-sm mt-3 tracking-wide"
              >
                Growth OS for Coaching Institutes
              </motion.p>

            </div>

            {/* 🔥 PROGRESS BAR */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-purple-500 to-blue-500"
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