'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type GlowColor    = 'violet' | 'blue' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'indigo';
type GlowPosition = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom';

interface GlowProps {
  color?:    GlowColor;
  size?:     number;
  blur?:     number;
  opacity?:  number;
  position?: GlowPosition;
  pulse?:    boolean;
  className?: string;
}

const COLOR_RGB: Record<GlowColor, string> = {
  violet:  '139,92,246',
  blue:    '59,130,246',
  cyan:    '6,182,212',
  emerald: '16,185,129',
  amber:   '245,158,11',
  rose:    '244,63,94',
  indigo:  '99,102,241',
};

const POSITION_CLASSES: Record<GlowPosition, string> = {
  center:       'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  top:          'top-0  left-1/2 -translate-x-1/2 -translate-y-1/2',
  bottom:       'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
  'top-left':   'top-0  left-0  -translate-x-1/2 -translate-y-1/2',
  'top-right':  'top-0  right-0  translate-x-1/2 -translate-y-1/2',
  'bottom-left':  'bottom-0 left-0  -translate-x-1/2 translate-y-1/2',
  'bottom-right': 'bottom-0 right-0  translate-x-1/2  translate-y-1/2',
};

export default function Glow({
  color    = 'violet',
  size     = 420,
  blur     = 130,
  opacity  = 0.13,
  position = 'center',
  pulse    = false,
  className,
}: GlowProps) {
  const rgb = COLOR_RGB[color];

  const el = (
    <div
      className={cn(
        'pointer-events-none absolute rounded-full',
        POSITION_CLASSES[position],
        className
      )}
      style={{
        width:  size,
        height: size,
        background: `rgba(${rgb},${opacity})`,
        filter: `blur(${blur}px)`,
      }}
    />
  );

  if (!pulse) return el;

  return (
    <motion.div
      className={cn(
        'pointer-events-none absolute rounded-full',
        POSITION_CLASSES[position],
        className
      )}
      style={{
        width:  size,
        height: size,
        background: `rgba(${rgb},${opacity})`,
        filter: `blur(${blur}px)`,
      }}
      animate={{ scale: [1, 1.08, 1], opacity: [opacity, opacity * 1.4, opacity] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}
