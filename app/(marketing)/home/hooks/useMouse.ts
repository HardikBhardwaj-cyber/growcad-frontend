import { useEffect, useRef, useState } from 'react';

interface MousePosition {
  x: number;
  y: number;
  /** Normalised -1..1 relative to viewport center */
  nx: number;
  ny: number;
}

/**
 * Returns raw mouse position (x, y) and viewport-normalised position (nx, ny).
 * Uses requestAnimationFrame throttling — safe to call every render.
 */
export function useMouse(): MousePosition {
  const [pos, setPos] = useState<MousePosition>({ x: 0, y: 0, nx: 0, ny: 0 });
  const frameRef = useRef<number>(0);

  useEffect(() => {
    let pending = false;

    const handler = (e: MouseEvent) => {
      if (pending) return;
      pending = true;
      frameRef.current = requestAnimationFrame(() => {
        setPos({
          x:  e.clientX,
          y:  e.clientY,
          nx: (e.clientX / window.innerWidth)  * 2 - 1,
          ny: (e.clientY / window.innerHeight) * 2 - 1,
        });
        pending = false;
      });
    };

    window.addEventListener('mousemove', handler, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handler);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return pos;
}
