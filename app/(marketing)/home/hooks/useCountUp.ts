"use client";

import { useEffect, useState } from "react";

export function useCountUp(target: number, duration = 1.5) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = target / (duration * 60);

    const interval = setInterval(() => {
      start += step;

      if (start >= target) {
        setValue(target);
        clearInterval(interval);
      } else {
        setValue(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [target, duration]);

  return value;
}