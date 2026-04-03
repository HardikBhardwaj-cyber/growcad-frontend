"use client";

import { motion } from "framer-motion";
import DashboardPreview from "./DashboardPreview";
import { useMouse } from "../../hooks/useMouse";

export default function HeroRight() {
  const { current } = useMouse(0.08);

  return (
    <div className="relative w-full flex justify-center items-center">
      
      {/* Container (important for spacing) */}
      <div className="relative w-full max-w-3xl flex justify-center items-center">

        {/* ---------------- BACKGROUND GLOW ---------------- */}
        <div className="absolute w-[500px] h-[500px] bg-white/10 blur-[140px] rounded-full opacity-40" />

        {/* ---------------- FLOATING ORB (TOP) ---------------- */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-16 -right-10 w-40 h-40 bg-gradient-to-tr from-white/20 to-transparent blur-3xl rounded-full"
        />

        {/* ---------------- FLOATING ORB (BOTTOM) ---------------- */}
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-16 -left-10 w-52 h-52 bg-gradient-to-br from-white/10 to-transparent blur-3xl rounded-full"
        />

        {/* ---------------- DASHBOARD (MAIN FOCUS) ---------------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            transform: `translate3d(${current.current.x * 0.01}px, ${current.current.y * 0.01}px, 0)`
          }}
          className="relative z-10"
        >
          <DashboardPreview />
        </motion.div>

      </div>
    </div>
  );
}