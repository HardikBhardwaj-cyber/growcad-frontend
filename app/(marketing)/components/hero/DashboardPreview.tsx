"use client";

import { motion } from "framer-motion";

export default function DashboardPreview() {
  return (
    <div className="relative">

      {/* GLOW BACKGROUND */}
      <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />

      {/* MAIN CARD */}
      <div className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-2xl">

        {/* TOP USERS */}
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

            {/* GLOW */}
            <motion.path
              d="M0 160 L80 120 L160 140 L240 80 L320 100 L400 60"
              fill="none"
              stroke="#a855f7"
              strokeWidth="8"
              opacity="0.2"
              filter="blur(10px)"
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

      {/* FLOATING ICONS */}
      <div className="absolute -left-10 top-20 flex flex-col gap-6">
        {["🎓", "📈", "💰"].map((icon, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 4 + i }}
            className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xl backdrop-blur-lg"
          >
            {icon}
          </motion.div>
        ))}
      </div>
    </div>
  );
}