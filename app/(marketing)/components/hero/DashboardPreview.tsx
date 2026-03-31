"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const smoothX = useSpring(rotateX, { stiffness: 100, damping: 20 });
  const smoothY = useSpring(rotateY, { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    rotateY.set((x - rect.width / 2) / 25);
    rotateX.set(-(y - rect.height / 2) / 25);
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
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity }}
      style={{
        rotateX: smoothX,
        rotateY: smoothY,
        transformPerspective: 1200,
      }}
      className="relative"
    >
      {/* GLOW */}
      <div className="absolute inset-0 bg-purple-500/20 blur-[100px] rounded-full" />

      {/* CARD */}
      <div className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl p-6 shadow-[0_20px_80px_rgba(124,58,237,0.25)]">

        {/* USERS */}
        <div className="flex gap-4 mb-6">
          {["Admin", "Faculty", "Student", "Parent"].map((role, i) => (
            <div key={i} className="flex flex-col items-center text-xs text-gray-300">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 mb-1 hover:scale-110 transition" />
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

            <motion.path
              d="M0 160 L80 120 L160 140 L240 80 L320 100 L400 60"
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />

          </svg>

          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
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