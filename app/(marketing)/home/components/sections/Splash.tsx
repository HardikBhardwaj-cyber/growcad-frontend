"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Splash() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2200); // duration of splash

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-999 flex items-center justify-center bg-black"
        >
          {/* Glow Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1 }}
            className="absolute w-400px h-400px bg-white/10 blur-[120px] rounded-full"
          />

          {/* Logo / Brand */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1], // premium easing
            }}
            className="relative flex flex-col items-center"
          >
            {/* Brand Name */}
            <motion.h1
              initial={{ letterSpacing: "0.2em", opacity: 0 }}
              animate={{ letterSpacing: "0.05em", opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-white text-4xl md:text-5xl font-semibold tracking-tight"
            >
              GROWCAD
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-neutral-400 text-sm mt-2 tracking-wide"
            >
              Growth OS for Coaching Institutes
            </motion.p>
          </motion.div>

          {/* Bottom Loader Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 right-0 h-2px bg-white origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}