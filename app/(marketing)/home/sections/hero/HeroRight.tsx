"use client";

import DashboardPreview from "./DashboardPreview";
import { motion } from "framer-motion";

export default function HeroRight() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
      className="relative flex justify-center lg:justify-end mt-10 lg:mt-0"
    >
      {/* BACK GLOW */}
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full" />

      {/* DASHBOARD */}
      <div className="relative scale-110 sm:scale-125 lg:scale-140 rotate-[-4deg]">
        <DashboardPreview />
      </div>
    </motion.div>
  );
}