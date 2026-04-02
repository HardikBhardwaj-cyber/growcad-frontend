"use client";

import { motion } from "framer-motion";

export default function GridBackground() {
  return (
    <>
      {/* 🔹 STATIC GRID (VERY LIGHT) */}
      <div className="absolute inset-0 opacity-[0.025]
        bg-[linear-gradient(rgba(124,58,237,0.5)_1px,transparent_1px),
        linear-gradient(90deg,rgba(124,58,237,0.5)_1px,transparent_1px)]
        [background-size:80px_80px]"
      />

      {/* 🔥 PRIMARY LIGHT (CENTER FOCUS) */}
      <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px]
        -translate-x-1/2 -translate-y-1/2
        bg-purple-600/15 blur-[180px] rounded-full"
      />

      {/* 🔥 SECONDARY LIGHT (SUBTLE DEPTH) */}
      <div className="absolute top-[65%] left-[60%] w-[700px] h-[700px]
        -translate-x-1/2 -translate-y-1/2
        bg-blue-500/8 blur-[160px] rounded-full"
      />

      {/* 🔹 VIGNETTE */}
      <div className="pointer-events-none absolute inset-0
        bg-[radial-gradient(circle_at_center,transparent_40%,#0a0a0f_100%)]"
      />
    </>
  );
}