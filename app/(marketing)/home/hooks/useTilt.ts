"use client";

import { useState, useCallback } from "react";

export function useTilt(maxTilt: number = 15) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();

      // Mouse position inside element
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Convert to -1 → 1 range
      const midX = rect.width / 2;
      const midY = rect.height / 2;

      const percentX = (x - midX) / midX;
      const percentY = (y - midY) / midY;

      // Apply tilt
      const rotateY = percentX * maxTilt;
      const rotateX = -percentY * maxTilt;

      setRotate({ x: rotateX, y: rotateY });
    },
    [maxTilt]
  );

  const handleLeave = useCallback(() => {
    // Reset smoothly
    setRotate({ x: 0, y: 0 });
  }, []);

  return {
    rotateX: rotate.x,
    rotateY: rotate.y,
    handleMove,
    handleLeave,
  };
}