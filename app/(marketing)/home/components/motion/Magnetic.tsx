'use client';

import { useRef, ReactNode, MouseEvent, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  scaleOnHover?: number;
  className?: string;
  as?: 'div' | 'span' | 'li';
}

export default function Magnetic({
  children,
  strength    = 0.38,
  scaleOnHover = 1.0,
  className,
}: MagneticProps) {
  const ref    = useRef<HTMLDivElement>(null);
  const canHover =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover)').matches;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { damping: 20, stiffness: 220, mass: 0.4 });
  const y = useSpring(rawY, { damping: 20, stiffness: 220, mass: 0.4 });

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!canHover) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set((e.clientX - (rect.left + rect.width  / 2)) * strength);
    rawY.set((e.clientY - (rect.top  + rect.height / 2)) * strength);
  };

  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      style={{ x, y }}
      whileHover={scaleOnHover !== 1.0 ? { scale: scaleOnHover } : undefined}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      transition={{ duration: 0.22 }}
    >
      {children}
    </motion.div>
  );
}
