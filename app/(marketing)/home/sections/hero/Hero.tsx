"use client";

import { motion } from "framer-motion";
import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* 🔥 BACKGROUND LAYERS */}

      {/* GRID FADE */}
      <div className="absolute inset-0 bg-grid opacity-[0.04]" />

      {/* PRIMARY GLOW */}
      <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 bg-purple-600/20 blur-[180px] rounded-full" />

      {/* SECONDARY GLOW */}
      <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full" />

      {/* 🔥 FLOATING ORB */}
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute left-10 top-24 w-6 h-6 bg-purple-400 rounded-full blur-sm opacity-60"
      />

      {/* 🔥 MAIN CONTAINER */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16 w-full">

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* LEFT */}
          <div className="z-10">
            <HeroLeft />
          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center lg:justify-end">
            <HeroRight />
          </div>

        </div>

      </div>

    </section>
  );
}