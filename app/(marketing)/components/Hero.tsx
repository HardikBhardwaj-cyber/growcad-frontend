"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">

      {/* 🔥 BACKGROUND */}
      <div className="absolute inset-0 bg-grid" />
      <div className="bg-glow top-[-100px] left-[-100px]" />
      <div className="bg-glow bg-glow-blue bottom-[-100px] right-[-100px]" />

      {/* 🔥 CONTENT */}
      <div className="relative z-10 px-6">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold gradient-text"
        >
          Growth OS for Coaching Institutes
        </motion.h1>

        <p className="text-gray-400 mt-6 max-w-xl mx-auto">
          Run your institute like a tech company. Automate everything.
        </p>

        <div className="flex gap-4 justify-center mt-8">
          <Button>Start Free</Button>
          <Button variant="secondary">Watch Demo</Button>
        </div>

      </div>
    </div>
  );
}