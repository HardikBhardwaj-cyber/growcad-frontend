"use client";

import { motion } from "framer-motion";
import { useMotion } from "../../systems/MotionProvider";
import DashboardPreview from "./DashboardPreview";

export default function HeroRight() {
  const { depth3X, depth3Y, drift } = useMotion();

  return (
    <motion.div
      style={{
        x: depth3X,
        y: depth3Y,
        translateY: drift,
      }}
      initial={{ opacity: 0, scale: 0.92, y: 80 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.4,
      }}
      className="relative flex justify-center lg:justify-end"
    >

      {/* 🔥 DEPTH WRAPPER */}
      <motion.div
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
        style={{
          transformPerspective: 1200,
        }}
      >
        <DashboardPreview />
      </motion.div>

      {/* 🔥 BACK GLOW */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600/20 blur-[160px] rounded-full -z-10" />

    </motion.div>
  );
}