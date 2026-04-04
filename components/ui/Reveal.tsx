"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { fadeIn, slideUp, scaleIn } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  variant?: "fade" | "slideUp" | "scale";
  delay?: number;
  className?: string;
};

export default function Reveal({
  children,
  variant = "slideUp",
  delay = 0,
  className = "",
}: RevealProps) {
  // 🔥 choose animation
  const variants =
    variant === "fade"
      ? fadeIn
      : variant === "scale"
      ? scaleIn
      : slideUp;

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{
        once: true,
        margin: "-50px", // 🔥 triggers earlier (premium feel)
      }}
      transition={{
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}