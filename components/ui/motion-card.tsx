"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// ✅ TYPES
type MotionCardProps = {
  children: ReactNode;
  className?: string;
};

export function MotionCard({
  children,
  className,
}: MotionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200 }}
      className={`glass rounded-2xl p-6 ${className || ""}`}
    >
      {children}
    </motion.div>
  );
}