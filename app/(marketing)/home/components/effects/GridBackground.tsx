"use client";

import { motion } from "framer-motion";
import { useParallax } from "../../hooks/useParallax";

export default function GridBackground() {
  const { y } = useParallax(0.1);

  return (
    <>
      <motion.div
        style={{ y }}
        className="absolute inset-0 opacity-20 bg-[radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:32px_32px]"
      />

      <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 bg-purple-600/20 blur-[200px] rounded-full" />
    </>
  );
}