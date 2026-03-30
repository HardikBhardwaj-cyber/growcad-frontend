"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Orb from "./hero/Orb";
import Particles from "./hero/Particles";
import MagneticButton from "./hero/MagneticButton";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-center">

      {/* 🌌 SUBTLE BACKGROUND */}
      <Particles />
      <div className="absolute inset-0 opacity-30">
        <Orb />
      </div>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

      {/* 🚀 CONTENT */}
      <div className="relative z-10 px-6 max-w-4xl mx-auto">

        {/* 🟣 BRAND */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-purple-400 mb-6 tracking-wide"
        >
          GROWCAD — Growth OS for Coaching Institutes
        </motion.p>

        {/* 🧠 HOOK (THIS IS YOUR WEAPON) */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
        >
          Beat Bigger Coaching Institutes.
        </motion.h1>

        {/* ✨ ONE LINE ONLY */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mt-6 text-lg"
        >
          Run your institute like a top brand.
        </motion.p>

        {/* 🎯 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col md:flex-row gap-4 justify-center mt-10"
        >
          <MagneticButton
            onClick={() => router.push("/auth/register")}
            primary
          >
            Start Free
          </MagneticButton>

          <MagneticButton
            onClick={() => window.open("https://youtube.com")}
          >
            Watch Demo
          </MagneticButton>
        </motion.div>

      </div>

      {/* 🔥 BOTTOM FADE */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}