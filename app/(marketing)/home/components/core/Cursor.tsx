'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Ring — slow spring
  const ringX = useSpring(mouseX, { damping: 26, stiffness: 200, mass: 0.4 });
  const ringY = useSpring(mouseY, { damping: 26, stiffness: 200, mass: 0.4 });

  // Dot — snappy spring
  const dotX = useSpring(mouseX, { damping: 50, stiffness: 900 });
  const dotY = useSpring(mouseY, { damping: 50, stiffness: 900 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onEnter = () => ringRef.current?.setAttribute('data-hover', 'true');
    const onLeave = () => ringRef.current?.removeAttribute('data-hover');

    window.addEventListener('mousemove', onMove, { passive: true });

    const targets = document.querySelectorAll('a, button, [data-cursor]');
    targets.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Ring */}
      <motion.div
        ref={ringRef}
        className="pointer-events-none fixed z-[9999] hidden lg:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.22)',
          mixBlendMode: 'difference',
        }}
      />
      {/* Dot */}
      <motion.div
        className="pointer-events-none fixed z-[9999] hidden lg:block"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: 5,
          height: 5,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.85)',
          mixBlendMode: 'difference',
        }}
      />
    </>
  );
}
