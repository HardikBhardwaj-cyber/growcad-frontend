"use client";

import { motion } from "framer-motion";
import Magnetic from "../motion/Magnetic";
import BlobCanvas from "../webgl/BlobCanvas";
import BubbleField from "../webgl/BubbleField";
import Particles from "../webgl/Particles";
import DashboardPreview from "./DashboardPreview";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* 🌌 BACKGROUND SYSTEM */}
      <div className="absolute inset-0 -z-10">
        <Particles />
        <BubbleField />
        <BlobCanvas />

        {/* 💡 LIGHTING */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(124,58,237,0.25),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.2),transparent_50%)]" />
      </div>

      {/* 🧠 MAIN GRID */}
      <div className="max-w-7xl mx-auto px-8 w-full grid md:grid-cols-2 gap-20 items-center">

        {/* LEFT */}
        <div className="space-y-10">

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-7xl font-bold leading-[1.1]"
          >
            Grow Your Institute <br />
            <span className="gradient-text text-glow">
              10x Faster
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-xl max-w-xl leading-relaxed"
          >
            Automate admissions, manage students, and scale your coaching
            business with one powerful platform.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <Magnetic>
              <button className="btn-primary px-10 py-4 text-lg">
                Start Free Trial
              </button>
            </Magnetic>

            <button className="btn-secondary px-8 py-4 text-lg">
              View Demo
            </button>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          <div className="scale-[1.1] md:scale-[1.2]">
            <DashboardPreview />
          </div>
        </div>

      </div>
    </section>
  );
}