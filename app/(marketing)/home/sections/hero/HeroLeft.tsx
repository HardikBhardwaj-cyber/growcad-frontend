"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../../systems/variants";
import MagneticButton from "../../components/ui/MagneticButton";

export default function HeroLeft() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col max-w-xl text-center lg:text-left"
    >

      {/* 🚀 BADGE */}
      <motion.div variants={fadeUp} className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 backdrop-blur-md relative overflow-hidden">

          <span className="relative z-10">
            🚀 Growth OS for Coaching Institutes
          </span>

          {/* 🔥 shimmer */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2.5s_infinite]" />
        </div>
      </motion.div>

      {/* 🔥 HEADLINE */}
      <motion.h1 variants={fadeUp} className="leading-[1.05]">

        <motion.span
          className="block text-3xl sm:text-4xl md:text-5xl font-medium text-white"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Beat bigger coaching institutes
        </motion.span>

        <motion.span
          className="block mt-2 text-3xl sm:text-4xl md:text-5xl text-white"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          with
        </motion.span>

        {/* 💎 GROWCAD */}
        <motion.span
          className="relative block mt-4 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-blue-400 to-purple-400"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            backgroundPosition: ["0% 50%", "100% 50%"],
          }}
          transition={{
            opacity: { delay: 0.4 },
            scale: { delay: 0.4 },
            backgroundPosition: {
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          style={{ backgroundSize: "200% 200%" }}
        >
          GROWCAD

          {/* 🔥 glow */}
          <span className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-purple-500 to-blue-500" />
        </motion.span>

      </motion.h1>

      {/* ✨ SUBTEXT */}
      <motion.p
        variants={fadeUp}
        className="text-gray-400 mt-6 text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0"
      >
        Automate admissions, manage students, and scale your institute —
        all from one powerful platform.
      </motion.p>

      {/* 🎯 CTA */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start"
      >

        {/* 🔥 PRIMARY */}
        <MagneticButton className="shadow-[0_0_30px_rgba(124,58,237,0.4)]">
          Get Early Access
        </MagneticButton>

        {/* 🔥 SECONDARY */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition backdrop-blur-md"
        >
          See Live Demo
        </motion.button>

      </motion.div>

      {/* ✅ TRUST */}
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap justify-center lg:justify-start gap-5 text-sm text-gray-500 mt-6"
      >
        <span className="hover:text-white transition">✔ No setup cost</span>
        <span className="hover:text-white transition">✔ Multi-branch ready</span>
        <span className="hover:text-white transition">✔ Built for scale</span>
      </motion.div>

    </motion.div>
  );
}