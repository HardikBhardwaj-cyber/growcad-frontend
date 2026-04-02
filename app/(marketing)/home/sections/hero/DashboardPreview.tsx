"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useTilt } from "../../hooks/useTilt";

export default function DashboardPreview() {
  const ref = useRef<HTMLDivElement | null>(null);

  const {
    rotateX,
    rotateY,
    glareX,
    glareY,
    handleMove,
    handleLeave,
  } = useTilt(18);

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        handleMove(e, ref.current.getBoundingClientRect());
      }}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
      }}
      className="relative w-[320px] sm:w-[420px] md:w-[480px] rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-[0_50px_150px_rgba(0,0,0,0.7)] overflow-hidden"
    >

      {/* 🔥 GLARE (INSANE EFFECT) */}
      <motion.div
        style={{
          background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.15), transparent 60%)`,
        }}
        className="absolute inset-0 pointer-events-none rounded-2xl"
      />

      {/* ✨ BREATHING GLOW */}
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-purple-500/10 blur-2xl"
      />

      {/* 🔔 MULTI NOTIFICATIONS */}
      <div className="absolute top-4 right-4 space-y-2">
        {["New student enrolled 🎉", "Fee received 💰"].map((text, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0, 1, 0],
              y: [20, 0, -20],
            }}
            transition={{
              duration: 4,
              delay: i * 1.5,
              repeat: Infinity,
            }}
            className="text-xs bg-white/10 border border-white/20 px-3 py-1 rounded-lg backdrop-blur-md"
          >
            {text}
          </motion.div>
        ))}
      </div>

      {/* 👤 USER ROLES */}
      <div className="flex gap-4 mb-6">
        {["Admin", "Faculty", "Student", "Parent"].map((role, i) => (
          <div key={i} className="flex flex-col items-center text-xs text-gray-300">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 mb-1" />
            {role}
          </div>
        ))}
      </div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/10 p-4 rounded-xl"
        >
          <p className="text-gray-400 text-sm">Revenue</p>
          <h2 className="text-white text-xl font-bold">₹1.2L</h2>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/10 p-4 rounded-xl"
        >
          <p className="text-gray-400 text-sm">Students</p>
          <h2 className="text-white text-xl font-bold">324</h2>
        </motion.div>
      </div>

      {/* 📈 CHART */}
      <div className="relative h-[150px]">

        <svg viewBox="0 0 400 150" className="w-full h-full">
          <defs>
            <linearGradient id="grad">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* LINE */}
          <motion.path
            d="M0 120 L80 90 L160 110 L240 60 L320 80 L400 40"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />

          {/* 🔥 MOVING DOT */}
          <motion.circle
            r="5"
            fill="#a855f7"
            animate={{
              cx: [0, 80, 160, 240, 320, 400],
              cy: [120, 90, 110, 60, 80, 40],
            }}
            transition={{ duration: 2 }}
          />
        </svg>

        {/* 🔥 GROWTH */}
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-2 right-2 text-green-400 text-sm font-semibold"
        >
          +18% Growth
        </motion.div>
      </div>

    </motion.div>
  );
}