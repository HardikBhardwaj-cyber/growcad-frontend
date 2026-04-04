"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

export default function Parallax({
  children,
  speed = 0.25,
  direction = "vertical", // 🔥 "vertical" | "horizontal"
  reverse = false,
}: {
  children: React.ReactNode;
  speed?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // 🔥 dynamic range (responsive)
  const distance = 300 * speed;
  const start = reverse ? distance : -distance;
  const end = reverse ? -distance : distance;

  const transformValue = useTransform(scrollYProgress, [0, 1], [start, end]);

  // 🔥 smooth spring (premium feel)
  const smooth = useSpring(transformValue, {
    stiffness: 120,
    damping: 20,
    mass: 0.3,
  });

  return (
    <motion.div
      ref={ref}
      style={
        direction === "vertical"
          ? { y: smooth }
          : { x: smooth }
      }
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}