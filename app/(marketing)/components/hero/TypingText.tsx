"use client";

import { useEffect, useState } from "react";

const texts = [
  "Beat bigger coaching institutes 🚀",
  "Automate your entire operations ⚡",
  "Scale without chaos 📈",
];

export default function TypingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-lg text-purple-400 font-medium">
      {texts[index]}
    </p>
  );
}