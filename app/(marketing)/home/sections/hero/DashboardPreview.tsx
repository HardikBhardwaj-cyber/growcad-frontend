"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useTilt } from "../../hooks/useTilt";

export default function DashboardPreview() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { rotateX, rotateY, handleMove, handleLeave } = useTilt(5);

  /* 🔥 LIVE DATA */
  const [revenue, setRevenue] = useState(120000);

  useEffect(() => {
    const interval = setInterval(() => {
      setRevenue((prev) => prev + Math.floor(Math.random() * 300));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const format = (num: number) =>
    "₹" + (num / 1000).toFixed(1) + "K";

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        handleMove(e.nativeEvent, ref.current.getBoundingClientRect());
      }}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 2000,
      }}
      className="relative w-[320px] sm:w-[420px] md:w-[520px] h-[360px]
      rounded-2xl bg-[#0b0b12] border border-white/10
      shadow-[0_60px_160px_rgba(0,0,0,0.9)] overflow-hidden"
    >
      {/* 🔹 SIDEBAR */}
      <div className="absolute left-0 top-0 h-full w-[70px] 
      bg-white/5 border-r border-white/10 p-3 flex flex-col gap-4">

        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs">
          🏠
        </div>

        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-xs">
          📊
        </div>

        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs">
          💰
        </div>
      </div>

      {/* 🔹 MAIN */}
      <div className="ml-[70px] p-4 h-full flex flex-col">

        {/* TOP */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white text-sm font-medium">
            Dashboard
          </h3>

          <span className="text-xs text-gray-500">
            Live
          </span>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 mb-3">

          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="text-gray-400 text-xs">Revenue</p>
            <motion.h2
              key={revenue}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              className="text-white text-sm font-semibold mt-1"
            >
              {format(revenue)}
            </motion.h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="text-gray-400 text-xs">Students</p>
            <h2 className="text-white text-sm font-semibold mt-1">
              324
            </h2>
          </div>
        </div>

        {/* CHART */}
        <div className="flex-1 relative">
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
          </svg>

          <div className="absolute bottom-1 right-2 text-green-400 text-[10px]">
            +18%
          </div>
        </div>
      </div>

      {/* 🔥 LIGHT */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl
      bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_70%)]" />
    </motion.div>
  );
}