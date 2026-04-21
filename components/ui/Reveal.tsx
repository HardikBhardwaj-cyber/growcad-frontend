"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { fadeIn, fadeUp, scaleIn } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  variant?: "fade" | "fadeUp" | "scale";
  delay?: number;
  className?: string;
};

export default function Reveal({
  children,
  variant = "fadeUp",
  delay = 0,
  className = "",
}: RevealProps) {
  // 🔥 choose animation
  const variants =
    variant === "fade"
      ? fadeIn
      : variant === "scale"
      ? scaleIn
      : fadeUp;

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
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