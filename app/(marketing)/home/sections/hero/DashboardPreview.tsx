"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useTilt } from "../../hooks/useTilt";

export default function DashboardPreview() {
  const ref = useRef<HTMLDivElement | null>(null);

  const { rotateX, rotateY, glareX, glareY, handleMove, handleLeave } = useTilt(14);

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
        transformPerspective: 1400,
      }}
      className="relative w-[360px] sm:w-[460px] md:w-[560px] rounded-3xl 
      bg-gradient-to-b from-white/10 to-white/5 
      border border-white/10 backdrop-blur-xl 
      p-6 shadow-[0_80px_200px_rgba(0,0,0,0.8)] overflow-hidden"
    >
      {/* 🔥 GLOW BACK */}
      <div className="absolute -inset-10 bg-purple-600/20 blur-[120px] opacity-40" />

      {/* GLARE */}
      <motion.div
        style={{
          background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.18), transparent 60%)`,
        }}
        className="absolute inset-0 pointer-events-none rounded-3xl"
      />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-red-400 rounded-full" />
          <div className="w-3 h-3 bg-yellow-400 rounded-full" />
          <div className="w-3 h-3 bg-green-400 rounded-full" />
        </div>
        <span className="text-xs text-gray-400">Growcad Dashboard</span>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <p className="text-gray-400 text-sm">Revenue</p>
          <h2 className="text-white text-2xl font-bold">₹1.2L</h2>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <p className="text-gray-400 text-sm">Students</p>
          <h2 className="text-white text-2xl font-bold">324</h2>
        </div>
      </div>

      {/* CHART */}
      <div className="relative h-[160px]">
        <svg viewBox="0 0 400 150" className="w-full h-full">
          <defs>
            <linearGradient id="grad">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          <motion.path
            d="M0 120 L80 90 L160 110 L240 60 L320 80 L400 40"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />

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

        <div className="absolute bottom-2 right-2 text-green-400 text-sm font-semibold">
          +18% Growth
        </div>
      </div>
    </motion.div>
  );
}