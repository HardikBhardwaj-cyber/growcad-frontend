'use client';

import { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

type OffsetType =
  | 'start start'
  | 'start end'
  | 'end start'
  | 'end end';

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  axis?: 'y' | 'x';
  spring?: boolean;
  className?: string;
  offset?: [OffsetType, OffsetType];
}

export default function Parallax({
  children,
  speed = 0.25,
  axis = 'y',
  spring = true,
  className,
  offset = ['start end', 'end start'],
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  const px = `${speed * 100}px`;

  const raw = useTransform(
    scrollYProgress,
    [0, 1],
    axis === 'y'
      ? [`-${px}`, px]
      : [`-${px}`, px]
  );

  const smoothed = useSpring(raw, {
    damping: 22,
    stiffness: 100,
    mass: 0.6,
  });

  const motionVal = spring ? smoothed : raw;

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <motion.div style={axis === 'y' ? { y: motionVal } : { x: motionVal }}>
        {children}
      </motion.div>
    </div>
  );
}