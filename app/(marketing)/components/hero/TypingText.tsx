"use client";

import { useEffect, useState } from "react";

const texts = [
  "Top AIR Factory",
  "Smart Coaching System",
  "AI Powered Institute",
];

export default function TypingText() {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let i = 0;
    const current = texts[index];

    const interval = setInterval(() => {
      setDisplay(current.slice(0, i));
      i++;
      if (i > current.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % texts.length);
          setDisplay("");
        }, 1500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <span className="gradient-text border-r border-purple-500 pr-1 animate-pulse">
      {display}
    </span>
  );
}