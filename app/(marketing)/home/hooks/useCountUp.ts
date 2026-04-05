import { useEffect, useRef, useState } from 'react';

type EasingFn = (t: number) => number;

interface CountUpOptions {
  duration?:  number;
  decimals?:  number;
  easing?:    EasingFn;
  prefix?:    string;
  suffix?:    string;
  separator?: string;
}

const easeOutQuart: EasingFn = (t) => 1 - Math.pow(1 - t, 4);
const easeOutExpo:  EasingFn = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

export const EASINGS = { easeOutQuart, easeOutExpo } as const;

/**
 * Animates a number from 0 to `target` when `start` becomes true.
 * Returns a formatted string with optional prefix/suffix/separator.
 */
export function useCountUp(
  target:  number,
  start:   boolean,
  options: CountUpOptions = {}
): string {
  const {
    duration  = 2.2,
    decimals  = 0,
    easing    = easeOutQuart,
    prefix    = '',
    suffix    = '',
    separator = ',',
  } = options;

  const [value, setValue] = useState(0);
  const rafRef  = useRef<number>(0);
  const startTs = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;

    startTs.current = null;

    const animate = (ts: number) => {
      if (!startTs.current) startTs.current = ts;
      const elapsed  = (ts - startTs.current) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easing(progress);

      setValue(parseFloat((eased * target).toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, start, duration, decimals, easing]);

  // Format number with separator
  const formatted = value.toFixed(decimals).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    separator
  );

  return `${prefix}${formatted}${suffix}`;
}
