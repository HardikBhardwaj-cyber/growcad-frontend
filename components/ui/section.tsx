"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// ✅ TYPES
type SectionProps = {
  children: ReactNode;
  className?: string;
};

export default function Section({
  children,
  className,
}: SectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
}