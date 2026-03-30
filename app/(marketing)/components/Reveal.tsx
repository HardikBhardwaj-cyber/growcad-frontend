"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
};

export default function Reveal({
  children,
  direction = "up",
  delay = 0,
}: RevealProps) {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 60 : direction === "down" ? -60 : 0,
      x: direction === "left" ? 60 : direction === "right" ? -60 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}