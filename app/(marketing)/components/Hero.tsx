"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Orb from "./hero/Orb";
import Particles from "./hero/Particles";
import MagneticButton from "./hero/MagneticButton";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">

      {/* 🌌 Background */}
      <Particles />
      <div className="absolute inset-0 opacity-40">
        <Orb />
      </div>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* 🔥 CONTENT WRAPPER */}
      <div className="relative z-10 w-full px-6 flex justify-center">
        
        <div className="max-w-3xl text-center">

          {/* 🟣 BRAND */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm md:text-base text-purple-400 tracking-wide mb-8 font-semibold"
          >
            GROWCAD — Growth OS for Coaching Institutes
          </motion.p>

          {/* 🧠 HOOK */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold leading-[1.1] text-white mb-6"
          >
            Beat Bigger <br />
            Coaching Institutes
          </motion.h1>

          {/* ✨ SUPPORT LINE */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10"
          >
            Run your institute like a top brand.
          </motion.p>

          {/* 🎯 CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
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
      </div>

      {/* 🔥 Bottom fade */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}