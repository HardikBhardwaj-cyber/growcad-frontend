"use client";

import DashboardPreview from "./DashboardPreview";
import { motion } from "framer-motion";

export default function HeroRight() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 80 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
      className="relative flex justify-center lg:justify-end -mr-10"
    >
      <div className="scale-110 lg:scale-125 rotate-[-3deg]">
        <DashboardPreview />
      </div>
    </motion.div>
  );
}