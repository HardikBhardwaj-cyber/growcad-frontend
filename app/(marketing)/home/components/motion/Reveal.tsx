'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode, useMemo } from 'react';
import { useReveal } from '../hooks/useReveal';
import { cn } from '@/lib/utils';
import { EASE_OUT } from '../../systems/design';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children:   ReactNode;
  delay?:     number;
  distance?:  number;
  direction?: Direction;
  blur?:      boolean;
  scale?:     boolean;
  className?: string;
  once?:      boolean;
  amount?:    number;
  duration?:  number;
}

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up:    { x: 0,  y: 1  },
  down:  { x: 0,  y: -1 },
  left:  { x: 1,  y: 0  },
  right: { x: -1, y: 0  },
  none:  { x: 0,  y: 0  },
};

export default function Reveal({
  children,
  delay     = 0,
  distance  = 40,
  direction = 'up',
  blur      = true,
  scale     = false,
  className,
  once      = true,
  amount    = 0.08,
  duration  = 0.72,
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
      ...(scale && { scale: 0.95 }),
      ...(blur  && { filter: 'blur(10px)' }),
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
      className={cn("w-full", className)}
      style={{ willChange: 'transform, opacity' }}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
}
