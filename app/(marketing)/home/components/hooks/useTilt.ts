"use client";

import { useState } from "react";

export function useTilt(maxTilt = 15) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotX = ((y - midY) / midY) * maxTilt;
    const rotY = ((x - midX) / midX) * -maxTilt;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return { rotateX, rotateY, handleMove, handleLeave };
}