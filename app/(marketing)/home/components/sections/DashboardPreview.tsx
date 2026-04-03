"use client";

import { useRef } from "react";
import { useTilt } from "../hooks/useTilt";

export default function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);

  const { rotateX, rotateY, handleMove, handleLeave } = useTilt(14);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      className="relative will-change-transform"
    >
      {/* 🔥 BACK GLOW */}
      <div className="absolute inset-0 bg-purple-600/30 blur-[120px] opacity-40 -z-20" />

      {/* 🔥 SECONDARY GLOW */}
      <div className="absolute inset-0 bg-blue-500/20 blur-[100px] opacity-30 -z-20" />

      {/* 🔥 MAIN CARD */}
      <div className="
        relative
        rounded-3xl
        border border-white/10
        bg-white/[0.04]
        backdrop-blur-2xl
        shadow-[0_40px_120px_rgba(0,0,0,0.6)]
        p-6 space-y-6
        overflow-hidden
      ">

        {/* 🔥 LIGHT REFLECTION */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div className="h-4 w-36 bg-white/20 rounded" />
          <div className="h-4 w-10 bg-white/10 rounded" />
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-3 gap-4">

          <div className="relative h-24 rounded-xl bg-gradient-to-br from-purple-500/40 to-purple-700/20 p-3 overflow-hidden">
            <div className="absolute inset-0 bg-white/10 blur-xl opacity-20" />
          </div>

          <div className="relative h-24 rounded-xl bg-gradient-to-br from-blue-500/40 to-blue-700/20 p-3 overflow-hidden">
            <div className="absolute inset-0 bg-white/10 blur-xl opacity-20" />
          </div>

          <div className="relative h-24 rounded-xl bg-white/10 p-3" />

        </div>

        {/* CHART */}
        <div className="relative h-40 rounded-xl bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-transparent overflow-hidden">

          {/* fake lines */}
          <div className="absolute inset-0 opacity-30">
            <div className="h-full w-full bg-[linear-gradient(to_top,transparent,rgba(255,255,255,0.1))]" />
          </div>

        </div>

        {/* TABLE */}
        <div className="space-y-3">
          <div className="h-3 bg-white/10 rounded w-full" />
          <div className="h-3 bg-white/10 rounded w-5/6" />
          <div className="h-3 bg-white/10 rounded w-4/6" />
        </div>

      </div>

      {/* 🔥 FLOAT SHADOW */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-20 bg-black/50 blur-3xl opacity-50 -z-10" />
    </div>
  );
}