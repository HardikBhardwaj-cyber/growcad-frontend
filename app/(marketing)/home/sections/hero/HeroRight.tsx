"use client";

import { motion } from "framer-motion";
import DashboardPreview from "./DashboardPreview";

export default function HeroRight() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 120, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.3,
      }}
      className="relative flex justify-center lg:justify-end mt-12 lg:mt-0"
    >

      {/* 🔥 BACK GLOW (DEPTH) */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500/30 blur-[140px] rounded-full" />

      {/* 🔥 FLOATING DASHBOARD */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [-3, -2, -3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <DashboardPreview />
      </motion.div>

    </motion.div>
  );
}