"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, ReactNode } from "react";

export default function Splash({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasSeen = sessionStorage.getItem("growcad_splash");

    if (hasSeen) {
      // ✅ defer this too (fixes YOUR error)
      const id = requestAnimationFrame(() => {
        setIsReady(true);
      });

      return () => cancelAnimationFrame(id);
    }

    // ✅ show splash (deferred)
    const raf = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // ✅ hide splash
    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("growcad_splash", "true");

      // ✅ also defer ready state
      requestAnimationFrame(() => {
        setIsReady(true);
      });
    }, 1600);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {/* 🔥 SPLASH */}
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.05,
              filter: "blur(10px)",
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
          >
            {/* GLOW */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 1 }}
              className="absolute w-[500px] h-[500px] bg-white/10 blur-[140px] rounded-full"
            />

            {/* LOGO */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative flex flex-col items-center"
            >
              <motion.h1
                initial={{ letterSpacing: "0.3em", opacity: 0 }}
                animate={{ letterSpacing: "0.05em", opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-white text-4xl md:text-5xl font-semibold"
              >
                GROWCAD
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.6, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-neutral-400 text-sm mt-2"
              >
                Growth OS for Coaching Institutes
              </motion.p>
            </motion.div>

            {/* LOADER */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 1.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-white origin-left"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔥 CONTENT */}
      {(isReady || !isVisible) && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}