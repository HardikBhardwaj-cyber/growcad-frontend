"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  duration?: number;
  decimals?: number;
  easing?: (t: number) => number;
};

export function useCountUp(
  target: number,
  { duration = 1.5, decimals = 0, easing }: Options = {}
) {
  const [value, setValue] = useState(0);

  const raf = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  // 🔥 DEFAULT EASING (easeOutCubic = premium feel)
  const ease =
    easing ||
    ((t: number) => 1 - Math.pow(1 - t, 3));

  useEffect(() => {
    if (raf.current) cancelAnimationFrame(raf.current);

    startTime.current = null;

    const animate = (time: number) => {
      if (!startTime.current) startTime.current = time;

      const elapsed = (time - startTime.current) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      const eased = ease(progress);
      const current = target * eased;

      const factor = Math.pow(10, decimals);
      setValue(Math.floor(current * factor) / factor);

      if (progress < 1) {
        raf.current = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };

    raf.current = requestAnimationFrame(animate);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration, decimals, ease]);

  return value;
}