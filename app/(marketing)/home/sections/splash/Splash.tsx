"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Splash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2800);

    // 🔊 OPTIONAL SOUND
    const audio = new Audio("/intro.mp3");
    audio.volume = 0.2;
    audio.play().catch(() => {});

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(10px)",
          }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0f] overflow-hidden"
        >

          {/* 🔥 FLASH BURST */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-purple-500"
          />

          {/* 🔥 DEPTH GLOW */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.4, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute w-[700px] h-[700px] bg-purple-600/20 blur-[200px] rounded-full"
          />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute w-[400px] h-[400px] bg-blue-500/10 blur-[160px] rounded-full"
          />

          {/* 🔥 CONTENT */}
          <div className="relative flex flex-col items-center gap-14">

            {/* 🔥 LOGO (MULTI STAGE) */}
            <motion.h1
              initial={{
                scale: 0.7,
                opacity: 0,
                filter: "blur(12px)",
              }}
              animate={{
                scale: [0.7, 1.05, 1],
                opacity: 1,
                filter: "blur(0px)",
                backgroundPosition: ["0% 50%", "100% 50%"],
              }}
              transition={{
                duration: 1.4,
                ease: [0.16, 1, 0.3, 1],
                backgroundPosition: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              className="relative text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-blue-400 to-purple-400"
              style={{ backgroundSize: "200% 200%" }}
            >
              GROWCAD

              {/* 🔥 PULSE GLOW */}
              <motion.span
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute inset-0 blur-2xl bg-gradient-to-r from-purple-500 to-blue-500"
              />
            </motion.h1>

            {/* 🔥 PROGRESS */}
            <div className="w-full max-w-[420px] h-[3px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 2.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full origin-left bg-linear-to-r from-purple-500 to-blue-500"
              />
            </div>

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}