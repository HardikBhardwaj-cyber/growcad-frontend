'use client';

import {
  createContext, useContext, useRef, useCallback,
  ReactNode, useEffect,
} from 'react';
import { useMotionValue, useSpring, MotionValue } from 'framer-motion';

interface ScrollCtx {
  scrollY:        MotionValue<number>;
  scrollProgress: MotionValue<number>;
  velocity:       MotionValue<number>;
}

const Ctx = createContext<ScrollCtx | null>(null);

export function ScrollContextProvider({ children }: { children: ReactNode }) {
  const scrollY        = useMotionValue(0);
  const scrollProgress = useMotionValue(0);
  const rawVelocity    = useMotionValue(0);
  const velocity       = useSpring(rawVelocity, { damping: 50, stiffness: 300, mass: 0.5 });

  const lastY    = useRef(0);
  const lastTime = useRef(0); // ✅ FIXED

  const onScroll = useCallback(() => {
    const y   = window.scrollY;
    const now = performance.now();

    const dt = Math.max(now - lastTime.current, 1);

    rawVelocity.set((y - lastY.current) / (dt / 16.67));

    const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);

    scrollY.set(y);
    scrollProgress.set(y / maxScroll);

    lastY.current    = y;
    lastTime.current = now;
  }, [scrollY, scrollProgress, rawVelocity]);

  useEffect(() => {
    // ✅ initialize here (safe)
    lastTime.current = performance.now();

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  return (
    <Ctx.Provider value={{ scrollY, scrollProgress, velocity }}>
      {children}
    </Ctx.Provider>
  );
}

export function useScrollContext() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useScrollContext requires ScrollContextProvider');
  return ctx;
}