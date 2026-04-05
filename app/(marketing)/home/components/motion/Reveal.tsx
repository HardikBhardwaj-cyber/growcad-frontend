'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode, useMemo } from 'react';
import { useReveal } from '../hooks/useReveal';
import { cn } from '@/lib/utils';
import { EASE_OUT } from '../../systems/design';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children:   ReactNode;
  /** Stagger delay in seconds */
  delay?:     number;
  /** Travel distance in px */
  distance?:  number;
  /** Entry direction */
  direction?: Direction;
  /** Gaussian blur on enter */
  blur?:      boolean;
  /** Slight scale on enter */
  scale?:     boolean;
  /** Class applied to wrapper div */
  className?: string;
  /** Only animate once (default: true) */
  once?:      boolean;
  /** Viewport intersection threshold */
  amount?:    number;
  /** Animation duration in seconds */
  duration?:  number;
}

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up:    { x: 0,   y: 1 },
  down:  { x: 0,   y: -1 },
  left:  { x: 1,   y: 0 },
  right: { x: -1,  y: 0 },
  none:  { x: 0,   y: 0 },
};

export default function Reveal({
  children,
  delay     = 0,
  distance  = 24,
  direction = 'up',
  blur      = true,
  scale     = false,
  className,
  once      = true,
  amount    = 0.1,
  duration  = 0.68,
}: RevealProps) {
  const [ref, inView] = useReveal<HTMLDivElement>({ once, amount });

  const { sx, sy } = useMemo(() => ({
    sx: OFFSET[direction].x * distance,
    sy: OFFSET[direction].y * distance,
  }), [direction, distance]);

  const variants = useMemo<Variants>(() => ({
    hidden: {
      opacity: 0,
      x: sx,
      y: sy,
      ...(scale && { scale: 0.96 }),
      ...(blur  && { filter: 'blur(7px)' }),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      ...(scale && { scale: 1 }),
      ...(blur  && { filter: 'blur(0px)' }),
      transition: { duration, delay, ease: EASE_OUT },
    },
  }), [sx, sy, scale, blur, duration, delay]);

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(className)}
      style={{ willChange: 'transform, opacity' }}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
}
