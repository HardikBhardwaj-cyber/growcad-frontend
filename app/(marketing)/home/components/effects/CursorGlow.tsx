'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * 3-layer cursor glow system:
 *  Ring A (slow, large)   — 680px ambient field
 *  Ring B (medium, mid)   — 280px accent glow
 *  Ring C (fast, small)   — 80px sharp highlight
 *
 * Each ring has a different spring config creating a
 * parallax-in-depth effect on cursor movement.
 */
export default function CursorGlow() {
  const rawX = useMotionValue(-800);
  const rawY = useMotionValue(-800);
  const frameRef = useRef<number>(0);

  // Three spring configs — slow / medium / fast
  const slowX  = useSpring(rawX, { damping: 45, stiffness: 100, mass: 1.2 });
  const slowY  = useSpring(rawY, { damping: 45, stiffness: 100, mass: 1.2 });
  const midX   = useSpring(rawX, { damping: 30, stiffness: 180, mass: 0.7 });
  const midY   = useSpring(rawY, { damping: 30, stiffness: 180, mass: 0.7 });
  const fastX  = useSpring(rawX, { damping: 18, stiffness: 350, mass: 0.3 });
  const fastY  = useSpring(rawY, { damping: 18, stiffness: 350, mass: 0.3 });

  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return;

    let pending = false;
    const onMove = (e: MouseEvent) => {
      if (pending) return;
      pending = true;
      frameRef.current = requestAnimationFrame(() => {
        rawX.set(e.clientX);
        rawY.set(e.clientY);
        pending = false;
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, [rawX, rawY]);

  const shared = 'pointer-events-none fixed z-[8] hidden lg:block rounded-full';
  const center = { translateX: '-50%', translateY: '-50%' };

  return (
    <>
      {/* Ring A — large ambient, slowest (deepest layer feel) */}
      <motion.div
        aria-hidden="true"
        className={shared}
        style={{
          ...center, x: slowX, y: slowY,
          width: 680, height: 680,
          background: 'radial-gradient(circle, rgba(109,40,217,0.065) 0%, rgba(37,99,235,0.035) 45%, transparent 72%)',
        }}
      />

      {/* Ring B — medium accent, mid speed */}
      <motion.div
        aria-hidden="true"
        className={shared}
        style={{
          ...center, x: midX, y: midY,
          width: 290, height: 290,
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(99,102,241,0.055) 50%, transparent 72%)',
        }}
      />

      {/* Ring C — tight sharp highlight, fastest */}
      <motion.div
        aria-hidden="true"
        className={shared}
        style={{
          ...center, x: fastX, y: fastY,
          width: 90, height: 90,
          background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
        }}
      />
    </>
  );
}
