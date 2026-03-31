"use client";

import { motion } from "framer-motion";
import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";
import { stagger } from "../../systems/variants";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* 🔥 GRADIENT BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0b0b1a] to-[#0a0a0f]" />

      {/* 🔥 RADIAL GLOW */}
      <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 bg-purple-600/20 blur-[160px] rounded-full" />

      {/* CONTENT */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center"
      >
        <HeroLeft />
        <HeroRight />
      </motion.div>
    </section>
  );
}