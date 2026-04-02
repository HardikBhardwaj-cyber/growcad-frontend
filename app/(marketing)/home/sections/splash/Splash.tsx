"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Splash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0f] overflow-hidden"
        >

          {/* 🔥 BACKGROUND GLOW SYSTEM */}
          <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[160px] rounded-full" />
          <div className="absolute w-[300px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full" />

          {/* 🔥 FLOATING PARTICLE */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-20 left-10 w-3 h-3 bg-purple-400 rounded-full blur-sm opacity-60"
          />

          {/* 🔥 CONTENT */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative text-center"
          >

            {/* 🔥 LOGO */}
            <motion.h1
              initial={{ letterSpacing: "0.2em", opacity: 0 }}
              animate={{
                letterSpacing: "0.05em",
                opacity: 1,
                backgroundPosition: ["0% 50%", "100% 50%"],
              }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
                backgroundPosition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-blue-400 to-purple-400"
              style={{ backgroundSize: "200% 200%" }}
            >
              GROWCAD

              {/* 🔥 GLOW */}
              <span className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-purple-500 to-blue-500" />
            </motion.h1>

            {/* ✨ TAGLINE */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 text-sm mt-4"
            >
              Growth OS for Coaching Institutes
            </motion.p>

            {/* 🔥 PROGRESS BAR */}
            <div className="mt-16 h-[3px] w-44 mx-auto bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 2.0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full w-full bg-linear-to-r from-purple-500 to-blue-500"
              />
            </div>

          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}