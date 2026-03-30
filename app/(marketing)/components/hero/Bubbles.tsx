"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const emojis = ["📚", "🧠", "📝", "🎯", "💰", "👨‍🎓"];

type Bubble = {
  emoji: string;
  x: number;
  y: number;
  delay: number;
  scale: number;
};

// ✅ safe generator
function generateBubbles(): Bubble[] {
  return emojis.map((emoji, i) => ({
    emoji,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: i * 0.6,
    scale: 0.8 + Math.random() * 0.6,
  }));
}

export default function Bubbles() {
  // ✅ PERFECT: lazy init (runs once, no lint issues)
  const [bubbles] = useState<Bubble[]>(() => generateBubbles());

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: b.scale }}
          animate={{
            y: [0, -50, 0],
            x: [0, 30, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [b.scale, b.scale + 0.1, b.scale],
          }}
          transition={{
            duration: 12,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute text-xl md:text-3xl select-none"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            filter: i % 2 === 0 ? "blur(1px)" : "none",
          }}
        >
          {b.emoji}
        </motion.div>
      ))}
    </div>
  );
}