"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useTilt } from "../../hooks/useTilt";

export default function DashboardPreview() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { smoothX, smoothY, handleMove } = useTilt();

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        handleMove(e, ref.current.getBoundingClientRect());
      }}
      style={{
        rotateX: smoothY,
        rotateY: smoothX,
        transformPerspective: 1200,
      }}
      className="relative w-[320px] sm:w-[400px] md:w-[440px] rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
    >

      {/* ✨ SHIMMER LIGHT SWEEP */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_5s_infinite]" />
      </div>

      {/* 🔔 LIVE ACTIVITY POPUP */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: [0, 1, 0],
          y: [20, 0, -20],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-4 right-4 text-xs bg-white/10 border border-white/20 px-3 py-1 rounded-lg backdrop-blur-md"
      >
        New student enrolled 🎉
      </motion.div>

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
        <div className="bg-white/10 p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Revenue</p>
          <h2 className="text-white text-xl font-bold">₹1.2L</h2>
        </div>

        <div className="bg-white/10 p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Students</p>
          <h2 className="text-white text-xl font-bold">324</h2>
        </div>
      </div>

      {/* 📈 CHART */}
      <div className="relative h-[140px]">

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

        </svg>

        {/* 🔥 LIVE GROWTH TEXT */}
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