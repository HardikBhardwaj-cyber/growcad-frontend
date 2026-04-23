// components/ui/Reveal.tsx
'use client';

import { motion, type Variants } from 'framer-motion';
import { type ReactNode }      from 'react';
import { cn }                  from '@/lib/utils';
import { fadeUp, fadeIn, scaleIn } from '@/lib/motion';  // slideUp does not exist — omitted

// ─── Types ────────────────────────────────────────────────────────────────────

type Variant = 'fadeUp' | 'fade' | 'scale';

interface RevealProps {
  children:  ReactNode;
  /** Animation preset. Default: 'fadeUp' (opacity + y-translate + blur). */
  variant?:  Variant;
  /** Seconds before the animation starts. Default: 0. */
  delay?:    number;
  className?: string;
}

// ─── Variant map ──────────────────────────────────────────────────────────────

const VARIANTS: Record<Variant, Variants> = {
  fadeUp: fadeUp,
  fade:   fadeIn,
  scale:  scaleIn,
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Reveal({
  children,
  variant   = 'fadeUp',
  delay     = 0,
  className,
}: RevealProps) {
  return (
    <motion.div
      variants={VARIANTS[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// Default export so both import styles work:
//   import { Reveal } from '@/components/ui/Reveal'   (used by the app)
//   import Reveal     from '@/components/ui/Reveal'   (used by older pages)
export default Reveal;
