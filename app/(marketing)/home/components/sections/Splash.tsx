"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, ReactNode } from "react";

export default function Splash({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            {/* Glow */}
            <div className="absolute w-[400px] h-[400px] bg-white/10 blur-[120px] rounded-full" />

            {/* Brand */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative flex flex-col items-center"
            >
              <h1 className="text-white text-4xl md:text-5xl font-semibold">
                GROWCAD
              </h1>

              <p className="text-neutral-400 text-sm mt-2">
                Growth OS for Coaching Institutes
              </p>
            </motion.div>

            {/* Loader */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2 }}
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-white origin-left"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔥 PAGE CONTENT */}
      {!isVisible && children}
    </>
  );
}