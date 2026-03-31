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

    const midX = rect.width / 2;
    const midY = rect.height / 2;

    rotateY.set((x - midX) / 25);
    rotateX.set(-(y - midY) / 25);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  // 📈 LINE PATH
  const path =
    "M10 120 L60 90 L110 100 L160 60 L210 70 L260 40 L310 20";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
      }}
      className="relative w-full h-[420px] rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl overflow-visible"
    >
      <div className="absolute inset-0 p-4 grid grid-cols-2 gap-4">

        {/* REVENUE */}
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400">Revenue</p>
          <div className="mt-2 h-6 w-20 bg-white/10 rounded animate-pulse" />
        </div>

        {/* STUDENTS */}
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400">Students</p>
          <div className="mt-2 h-6 w-16 bg-white/10 rounded animate-pulse" />
        </div>

        {/* GROWTH LINE */}
        <div className="bg-white/10 rounded-xl p-4 col-span-2 relative overflow-visible">
          <p className="text-sm text-gray-400 mb-3">Growth</p>

          <svg viewBox="0 0 340 140" className="w-full h-[140px] overflow-visible">

            {/* DEFINITIONS */}
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>

              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* GLOW LINE */}
            <motion.path
              d={path}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="6"
              opacity="0.3"
              filter="url(#glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />

            {/* MAIN LINE */}
            <motion.path
              d={path}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />

            {/* MOVING DOT */}
            <motion.circle
              r="5"
              fill="#a855f7"
              filter="url(#glow)"
              style={{
                offsetPath: `path("${path}")`,
                offsetDistance: "100%",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            />

            {/* ARROW OUTSIDE */}
            <motion.polygon
              points="310,20 325,10 320,25"
              fill="#8b5cf6"
              initial={{ opacity: 0, x: -10, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.8 }}
            />
          </svg>
        </div>
      </div>

      {/* GLOW */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full" />
    </motion.div>
  );
}