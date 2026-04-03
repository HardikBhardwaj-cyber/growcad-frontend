"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useTilt } from "../../hooks/useTilt";

export default function DashboardPreview() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { rotateX, rotateY, handleMove, handleLeave } = useTilt(6);

  // 🔥 LIVE REVENUE SIMULATION
  const [revenue, setRevenue] = useState(120000);

  useEffect(() => {
    const interval = setInterval(() => {
      setRevenue((prev) => prev + Math.floor(Math.random() * 500));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const format = (num: number) =>
    "₹" + (num / 1000).toFixed(1) + "K";

  // 🔥 ACTIVITY ENGINE
  const activities = [
    "+₹5,200 collected",
    "New student enrolled",
    "Attendance marked",
    "Reminder sent",
  ];

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
        transformPerspective: 1800,
      }}
      className="relative w-[400px] sm:w-[520px] md:w-[680px] h-[420px]
      rounded-3xl bg-[#0b0b12] border border-white/10
      shadow-[0_100px_250px_rgba(0,0,0,0.95)] overflow-hidden"
    >

      {/* 🔥 FLOATING ACTIVITIES */}
      {activities.map((text, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: [0, 1, 0],
            y: [30, 0, -20],
          }}
          transition={{
            duration: 6,
            delay: i * 1.5,
            repeat: Infinity,
          }}
          className="absolute right-6 top-[20px] text-xs 
          bg-white/10 border border-white/20 px-3 py-1 
          rounded-lg backdrop-blur-md"
        >
          {text}
        </motion.div>
      ))}

      {/* 🔹 SIDEBAR */}
      <div className="absolute left-0 top-0 h-full w-[90px] 
      bg-white/5 border-r border-white/10 p-3 flex flex-col gap-4">

        {/* ACTIVE INDICATOR */}
        <div className="absolute left-0 top-4 w-[3px] h-8 bg-purple-500 rounded-full" />

        {["🏠", "👨‍🎓", "📊", "💰", "⚙️"].map((icon, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-lg bg-white/10 
            flex items-center justify-center text-sm cursor-pointer"
          >
            {icon}
          </motion.div>
        ))}
      </div>

      {/* 🔹 MAIN CONTENT */}
      <div className="ml-[90px] p-5 h-full flex flex-col">

        {/* 🔸 TOP BAR */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-sm font-medium">
            Dashboard
          </h3>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live
          </div>
        </div>

        {/* 🔸 STATS */}
        <div className="grid grid-cols-3 gap-3 mb-4">

          {/* STUDENTS */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 transition hover:bg-white/10">
            <p className="text-gray-400 text-xs">Students</p>
            <motion.h2
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white text-sm font-semibold mt-1"
            >
              324
            </motion.h2>
          </div>

          {/* REVENUE */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 transition hover:bg-white/10">
            <p className="text-gray-400 text-xs">Revenue</p>
            <motion.h2
              key={revenue}
              initial={{ opacity: 0.5, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-sm font-semibold mt-1"
            >
              {format(revenue)}
            </motion.h2>
          </div>

          {/* GROWTH */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 transition hover:bg-white/10">
            <p className="text-gray-400 text-xs">Growth</p>
            <h2 className="text-green-400 text-sm font-semibold mt-1">
              +18%
            </h2>
          </div>

        </div>

        {/* 🔸 CHART */}
        <motion.div
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="relative flex-1"
        >
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
              strokeWidth="3.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />

            {/* MOVING DOT */}
            <motion.circle
              r="4"
              fill="#a855f7"
              animate={{
                cx: [0, 80, 160, 240, 320, 400],
                cy: [120, 90, 110, 60, 80, 40],
              }}
              transition={{ duration: 2 }}
            />

            {/* ACTIVE POINT */}
            <motion.circle
              r="5"
              fill="#a855f7"
              animate={{
                cx: 400,
                cy: 40,
                scale: [1, 1.5, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>

          <div className="absolute bottom-2 right-2 text-green-400 text-xs font-semibold">
            +18% this month
          </div>
        </motion.div>

        {/* 🔸 ACTIONS */}
        <div className="flex gap-2 mt-3">
          {["Add Student", "Collect Fees", "Reports"].map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xs bg-white/10 px-3 py-1 rounded-lg cursor-pointer"
            >
              {t}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🤖 AI ASSISTANT */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 right-6 w-[180px] 
        bg-white/10 border border-white/20 rounded-xl 
        p-3 backdrop-blur-md"
      >
        <p className="text-xs text-gray-400 mb-2">AI Assistant</p>

        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs text-white"
        >
          Suggest sending fee reminder to 12 students
        </motion.div>

        <div className="mt-2 text-[10px] text-purple-400">
          Auto Insight
        </div>
      </motion.div>

      {/* 🔥 GLOBAL LIGHT */}
      <div className="absolute inset-0 pointer-events-none rounded-3xl
      bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />

      {/* 🔥 SHADOW */}
      <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 w-[70%] h-[60px] bg-black/60 blur-3xl rounded-full" />

      {/* 🔥 FOCUS FLOW */}
      <motion.div
        animate={{ opacity: [0, 0.15, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent pointer-events-none"
      />
    </motion.div>
  );
}