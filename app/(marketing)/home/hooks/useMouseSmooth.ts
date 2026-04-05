import { useEffect } from 'react';
import { useMotionValue, useSpring, MotionValue } from 'framer-motion';

interface SpringConfig {
  damping?:   number;
  stiffness?: number;
  mass?:      number;
}

interface MouseSmooth {
  x:  MotionValue<number>;
  y:  MotionValue<number>;
  /** Viewport-normalised −1..1 (useful for shader uniforms) */
  nx: MotionValue<number>;
  ny: MotionValue<number>;
}

const DEFAULTS: Required<SpringConfig> = {
  damping:   28,
  stiffness: 180,
  mass:      0.5,
};

/**
 * Spring-smoothed mouse position.
 * Returns Framer Motion MotionValues — plug directly into `style` props.
 */
export function useMouseSmooth(config: SpringConfig = {}): MouseSmooth {
  const cfg = { ...DEFAULTS, ...config };

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawNX = useMotionValue(0);
  const rawNY = useMotionValue(0);

  const x  = useSpring(rawX,  cfg);
  const y  = useSpring(rawY,  cfg);
  const nx = useSpring(rawNX, cfg);
  const ny = useSpring(rawNY, cfg);

  useEffect(() => {
    let pending = false;
    let rafId: number;

    const handler = (e: MouseEvent) => {
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(() => {
        rawX.set(e.clientX);
        rawY.set(e.clientY);
        rawNX.set((e.clientX / window.innerWidth)  * 2 - 1);
        rawNY.set((e.clientY / window.innerHeight) * 2 - 1);
        pending = false;
      });
    };

    window.addEventListener('mousemove', handler, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handler);
      cancelAnimationFrame(rafId);
    };
  }, [rawX, rawY, rawNX, rawNY]);

  return { x, y, nx, ny };
}
