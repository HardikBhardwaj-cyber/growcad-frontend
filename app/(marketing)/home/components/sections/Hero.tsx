"use client";

import { motion } from "framer-motion";
import Magnetic from "../motion/Magnetic";
import BlobCanvas from "../webgl/BlobCanvas";
import BubbleField from "../webgl/BubbleField";
import Particles from "../webgl/Particles";
import DashboardPreview from "./DashboardPreview";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">

      {/* 🌌 Background layers */}
      <Particles />
      <BubbleField />
      <BlobCanvas />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div className="space-y-8">

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-white leading-tight"
          >
            Grow Your Institute <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              10x Faster
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg max-w-lg"
          >
            Automate admissions, manage students, and scale your coaching
            business with one powerful platform.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Magnetic>
              <button className="px-8 py-4 rounded-xl bg-white text-black font-semibold">
                Get Started
              </button>
            </Magnetic>
          </motion.div>

        </div>

        {/* RIGHT DASHBOARD */}
        <DashboardPreview />

      </div>
    </section>
  );
}