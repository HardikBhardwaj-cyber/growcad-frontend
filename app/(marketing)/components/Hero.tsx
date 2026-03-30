"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Particles from "./hero/Particles";
import Orb from "./hero/Orb";
import MagneticButton from "./hero/MagneticButton";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-center">

      {/* 🌌 BACKGROUND (CLEAN, NOT CLUTTERED) */}
      <Particles />

      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* 🔥 SUBTLE ORB */}
      <div className="absolute inset-0 opacity-40">
        <Orb />
      </div>

      {/* 🚀 MAIN CONTENT */}
      <div className="relative z-10 px-6 max-w-4xl mx-auto">

        {/* 🧠 BRAND TAG */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-purple-400 mb-4 tracking-wide"
        >
          GROWCAD — Growth OS for Coaching Institutes
        </motion.p>

        {/* 🧠 HEADLINE */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
        >
          Compete With Big Coaching Giants.
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Grow Faster. Scale Smarter.
          </span>
        </motion.h1>

        {/* ✨ SUBTEXT */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mt-6 text-lg md:text-xl max-w-2xl mx-auto"
        >
          Automate your institute — fees, attendance, tests, and growth —
          everything in one powerful platform.
        </motion.p>

        {/* 💣 EMOTIONAL LINE */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-sm text-purple-300"
        >
          Built for small & mid-size institutes to win big.
        </motion.p>

        {/* 🎯 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col md:flex-row gap-4 justify-center mt-10"
        >
          <MagneticButton
            onClick={() => router.push("/auth/register")}
            primary
          >
            Start Free — Takes 2 Minutes
          </MagneticButton>

          <MagneticButton
            onClick={() => window.open("https://youtube.com")}
          >
            Watch Demo
          </MagneticButton>
        </motion.div>

        {/* 💎 TRUST */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-sm text-gray-500"
        >
          Trusted by 500+ institutes • 10K+ students • ₹1Cr+ fees managed
        </motion.p>

        {/* 📊 SIMPLE STATS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex flex-wrap justify-center gap-8 text-center text-sm text-gray-400"
        >
          <div>
            <p className="text-xl font-bold text-white">10K+</p>
            Students
          </div>
          <div>
            <p className="text-xl font-bold text-white">500+</p>
            Institutes
          </div>
          <div>
            <p className="text-xl font-bold text-white">32%</p>
            Avg Growth
          </div>
        </motion.div>

      </div>

      {/* 🔥 BOTTOM FADE */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}