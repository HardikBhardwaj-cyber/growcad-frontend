"use client";

import { useRef } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    rotateY.set((x - rect.width / 2) / 30);
    rotateX.set(-(y - rect.height / 2) / 30);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 60, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
      }}
      className="relative"
    >
      {/* GLOW */}
      <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />

      {/* CARD */}
      <div className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-2xl">

        {/* USERS */}
        <div className="flex gap-4 mb-6">
          {["Admin", "Faculty", "Student", "Parent"].map((role, i) => (
            <div key={i} className="flex flex-col items-center text-xs text-gray-300">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 mb-1" />
              {role}
            </div>
          ))}
        </div>

        {/* STATS */}
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

        {/* CHART */}
        <div className="relative h-[200px]">

          <svg viewBox="0 0 400 200" className="w-full h-full">

            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            {/* GRID */}
            <g opacity="0.1">
              {[...Array(10)].map((_, i) => (
                <line key={i} x1="0" y1={i * 20} x2="400" y2={i * 20} stroke="white" />
              ))}
            </g>

            {/* LINE */}
            <motion.path
              d="M0 160 L80 120 L160 140 L240 80 L320 100 L400 60"
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />

            {/* DOT */}
            <motion.circle
              r="5"
              fill="#a855f7"
              animate={{
                cx: [0, 80, 160, 240, 320, 400],
                cy: [160, 120, 140, 80, 100, 60],
              }}
              transition={{ duration: 2 }}
            />
          </svg>

          {/* FLOAT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-4 right-4 bg-white/10 border border-white/20 p-3 rounded-xl text-sm"
          >
            <p className="text-gray-400">Conversion</p>
            <p className="text-green-400 font-bold">+18%</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}