"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string; // ✅ FIX
};

export default function PageWrapper({ children, className }: Props) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      className={cn(className)} // ✅ FIX
    >
      {children}
    </motion.div>
  );
}