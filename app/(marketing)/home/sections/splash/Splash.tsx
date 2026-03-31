"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Splash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0a0a0f]"
        >
          {/* GLOW BACKGROUND */}
          <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full" />

          {/* LOGO / TEXT */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative text-center"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400">
              GROWCAD
            </h1>

            {/* LOADING BAR */}
            <div className="mt-6 h-[3px] w-40 mx-auto bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                className="h-full w-full bg-gradient-to-r from-purple-500 to-blue-500"
              />
            </div>

            <p className="text-gray-500 text-sm mt-4">
              Growth OS for Coaching Institutes
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}