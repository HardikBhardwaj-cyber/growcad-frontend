"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

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

    rotateY.set((x - midX) / 20);
    rotateX.set(-(y - midY) / 20);
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
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      className="relative w-full h-[420px] rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl"
    >
      {/* DASHBOARD GRID */}
      <div className="absolute inset-0 p-4 grid grid-cols-2 gap-4">

        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400">Revenue</p>
          <h2 className="text-xl font-bold text-white">₹4.2L</h2>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400">Students</p>
          <h2 className="text-xl font-bold text-white">1,284</h2>
        </div>

        <div className="bg-white/10 rounded-xl p-4 col-span-2">
          <p className="text-sm text-gray-400">Growth</p>
          <div className="h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg mt-2" />
        </div>
      </div>

      {/* FLOATING KPI */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute -bottom-6 -right-6 bg-purple-500/20 backdrop-blur-lg border border-purple-400/20 p-4 rounded-xl"
      >
        <p className="text-sm text-white">+32% Admissions</p>
      </motion.div>
    </motion.div>
  );
}