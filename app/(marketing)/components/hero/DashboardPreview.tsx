"use client";

import { motion } from "framer-motion";

export default function DashboardPreview() {
  return (
    <div className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-2xl overflow-hidden">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-semibold">Dashboard</h3>
        <span className="text-green-400 text-sm">● Live</span>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Revenue</p>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white text-xl font-bold"
          >
            ₹1.2L
          </motion.h2>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Students</p>
          <h2 className="text-white text-xl font-bold">324</h2>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Conversion</p>
          <h2 className="text-green-400 text-xl font-bold">+18%</h2>
        </div>
      </div>

      {/* LINE CHART */}
      <div className="relative h-[180px]">

        <svg viewBox="0 0 400 180" className="w-full h-full">

          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          <motion.path
            d="M0 150 L80 100 L160 120 L240 60 L320 80 L400 40"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />

          {/* MOVING DOT */}
          <motion.circle
            r="5"
            fill="#a855f7"
            animate={{
              cx: [0, 80, 160, 240, 320, 400],
              cy: [150, 100, 120, 60, 80, 40],
            }}
            transition={{ duration: 2 }}
          />
        </svg>

        {/* FLOATING ACTIVITY */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute top-2 right-2 bg-white/10 px-3 py-1 rounded-lg text-xs text-green-400"
        >
          +12 new admissions
        </motion.div>
      </div>
    </div>
  );
}