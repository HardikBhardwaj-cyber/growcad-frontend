'use client';

import { useRef, ReactNode } from 'react';
import {
  motion,
  useScroll, useTransform, useSpring, useMotionTemplate,
} from 'framer-motion';
import { EASE_OUT } from '../../systems/design';

interface SceneWrapperProps {
  children:  ReactNode;
  className?: string;
  /** How deep the exit scale goes. Default 0.97 */
  exitScale?: number;
  /** Entry Y travel in px. Default 0 (scale/opacity only for section wrappers) */
  entryY?: number;
}

/**
 * SceneWrapper — wraps every section to create ONE continuous narrative.
 *
 * Scroll model per section:
 *   [0.00 → 0.12]  entry:  scale 0.97→1, opacity 0→1   (section arrives)
 *   [0.12 → 0.75]  hold:   scale 1, opacity 1            (section is active)
 *   [0.75 → 1.00]  exit:   scale 1→0.97, opacity 1→0.7  (scene recedes)
 *
 * All values driven by MotionValues — zero re-renders, GPU-composited.
 */
export default function SceneWrapper({
  children,
  className = '',
  exitScale = 0.97,
  entryY = 0,
}: SceneWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Entry phase [0 → 0.18]: scale 0.97→1, opacity 0.5→1
  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.18, 0.78, 1],
    [exitScale, 1, 1, exitScale],
  );
  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.14, 0.72, 1],
    [0.5, 1, 1, 0.65],
  );
  const rawY = useTransform(
    scrollYProgress,
    [0, 0.2],
    [entryY, 0],
  );

  // Spring-smooth everything so there's no abrupt snapping
  const scale   = useSpring(rawScale,   { damping: 32, stiffness: 180, mass: 0.6 });
  const opacity = useSpring(rawOpacity, { damping: 32, stiffness: 180, mass: 0.6 });
  const y       = useSpring(rawY,       { damping: 28, stiffness: 140, mass: 0.5 });

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity, y, willChange: 'transform, opacity' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
