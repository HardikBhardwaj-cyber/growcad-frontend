"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useTilt } from "../hooks/useTilt";

export default function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);

  const { rotateX, rotateY, handleMove, handleLeave } = useTilt(12);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      className="relative"
    >
      {/* 🔥 Glass Dashboard */}
      <div className="rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl bg-white/5 shadow-2xl p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="h-4 w-32 bg-white/20 rounded" />
          <div className="h-4 w-10 bg-white/10 rounded" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-purple-500/30 rounded-lg" />
          <div className="h-24 bg-blue-500/30 rounded-lg" />
          <div className="h-24 bg-white/10 rounded-lg" />
        </div>

        {/* Chart area */}
        <div className="h-40 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl" />

        {/* Table */}
        <div className="space-y-2">
          <div className="h-3 bg-white/10 rounded" />
          <div className="h-3 bg-white/10 rounded" />
          <div className="h-3 bg-white/10 rounded" />
        </div>
      </div>

      {/* 🔥 Glow */}
      <div className="absolute inset-0 bg-purple-500/20 blur-3xl -z-10" />
    </motion.div>
  );
}