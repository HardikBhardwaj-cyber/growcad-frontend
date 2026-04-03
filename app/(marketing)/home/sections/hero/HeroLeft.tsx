"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroLeft() {
  return (
    <div className="w-full flex justify-center">
      {/* Container for proper spacing */}
      <div className="max-w-xl w-full px-6 md:px-0 space-y-8">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <span className="text-xs text-neutral-300 tracking-wide">
            Coming Soon
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl font-semibold leading-[1.1] tracking-tight text-white"
        >
          Growcad
          <br />
          <span className="text-neutral-400 font-medium text-2xl md:text-4xl">
            Growth OS for Coaching Institutes
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-neutral-400 text-lg leading-relaxed max-w-lg"
        >
          Automate admissions, manage students, and scale your institute —
          without increasing operational complexity.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 pt-2"
        >
          {/* Primary Button */}
          <button className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-medium hover:scale-[1.03] transition-all duration-300">
            Join Waitlist
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Secondary Button */}
          <button className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all duration-300">
            View Demo
          </button>
        </motion.div>

        {/* Subtle Trust Line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-sm text-neutral-500 pt-4"
        >
          Built for modern coaching institutes • Early access opening soon
        </motion.div>
      </div>
    </div>
  );
}