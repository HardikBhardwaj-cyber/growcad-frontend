"use client";

import { motion, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTilt } from "../../hooks/useTilt";
import { useMotion } from "../../systems/MotionProvider";
import { useCountUp } from "../../hooks/useCountUp";

export default function DashboardPreview() {
  const ref = useRef<HTMLDivElement | null>(null);

  const {
    rotateX,
    rotateY,
    glareX,
    glareY,
    handleMove,
    handleLeave,
  } = useTilt(18);

  const { scrollProgress } = useMotion();

  /* 🔥 GRAPH CONTROL (SCROLL BASED) */
  const pathLength = useTransform(scrollProgress, [0, 0.4], [0, 1]);

  /* 🔥 LIVE DATA */
  const revenue = useCountUp(120000);
  const students = useCountUp(324);

  /* 🔥 GROWTH DYNAMIC */
  const growth = useTransform(scrollProgress, [0, 0.5], [5, 18]);

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
        transformPerspective: 1200,
      }}
      className="relative w-[320px] sm:w-[420px] md:w-[480px] rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-[0_50px_150px_rgba(0,0,0,0.7)] overflow-hidden"
    >

      {/* 🔥 GLARE */}
      <motion.div
        style={{
          background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.15), transparent 60%)`,
        }}
        className="absolute inset-0 pointer-events-none rounded-2xl"
      />

      {/* ✨ BREATHING GLOW */}
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-purple-500/10 blur-2xl"
      />

      {/* 🔔 SMART NOTIFICATIONS (NO LOOP SPAM) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: scrollProgress.get() > 0.2 ? 1 : 0,
          y: scrollProgress.get() > 0.2 ? 0 : 20,
        }}
        className="absolute top-4 right-4 text-xs bg-white/10 border border-white/20 px-3 py-1 rounded-lg backdrop-blur-md"
      >
        New student enrolled 🎉
      </motion.div>

      {/* 👤 USERS */}
      <div className="flex gap-4 mb-6">
        {["Admin", "Faculty", "Student", "Parent"].map((role) => (
          <div key={role} className="flex flex-col items-center text-xs text-gray-300">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 mb-1" />
            {role}
          </div>
        ))}
      </div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white/10 p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Revenue</p>
          <h2 className="text-white text-xl font-bold">
            ₹{(revenue / 1000).toFixed(1)}K
          </h2>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-white/10 p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Students</p>
          <h2 className="text-white text-xl font-bold">
            {students}
          </h2>
        </motion.div>
      </div>

      {/* 📈 GRAPH */}
      <div className="relative h-[150px]">

        <svg viewBox="0 0 400 150" className="w-full h-full">

          <defs>
            <linearGradient id="grad">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* 🔥 LINE */}
          <motion.path
            d="M0 120 L80 90 L160 110 L240 60 L320 80 L400 40"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="3"
            style={{ pathLength }}
          />

        </svg>

        {/* 🔥 DYNAMIC GROWTH */}
        <motion.div className="absolute bottom-2 right-2 text-green-400 text-sm font-semibold">
          +{Math.round(growth.get())}% Growth
        </motion.div>

      </div>

    </motion.div>
  );
}