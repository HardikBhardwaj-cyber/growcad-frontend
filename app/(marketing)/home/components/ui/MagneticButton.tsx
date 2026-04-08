'use client';

import { ReactNode, useRef, useState, MouseEvent as RMouseEvent, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children:  ReactNode;
  variant?:  'primary' | 'outline';
  className?: string;
  onClick?:  () => void;
}

export default function MagneticButton({
  children,
  variant  = 'primary',
  className,
  onClick,
}: MagneticButtonProps) {
  const ref      = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [canHover, setCanHover] = useState(false);

  const canHoverRef = useRef(false);

  useEffect(() => {
  if (typeof window === 'undefined') return;

  const media = window.matchMedia('(hover: hover)');
  canHoverRef.current = media.matches;

  const handler = (e: MediaQueryListEvent) => {
    canHoverRef.current = e.matches;
  };

  media.addEventListener('change', handler);
  return () => media.removeEventListener('change', handler);
}, []);


  

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { damping: 18, stiffness: 200, mass: 0.4 });
  const y = useSpring(rawY, { damping: 18, stiffness: 200, mass: 0.4 });

  const onMouseMove = (e: RMouseEvent<HTMLButtonElement>) => {
    if (!canHoverRef.current) return;
    const el   = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set((e.clientX - (rect.left + rect.width  / 2)) * 0.4);
    rawY.set((e.clientY - (rect.top  + rect.height / 2)) * 0.4);
  };

  const onMouseLeave = () => { rawX.set(0); rawY.set(0); setHovered(false); };
  const onMouseEnter = () => setHovered(true);

  const isPrimary = variant === 'primary';

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.055 }}
      whileTap={{ scale: 0.955 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group relative inline-flex cursor-pointer select-none items-center justify-center gap-2.5',
        'overflow-hidden rounded-full text-[14px] font-semibold tracking-[-0.01em]',
        isPrimary
          ? 'bg-gradient-to-r from-violet-600 via-violet-600 to-blue-600 px-8 py-4 text-white shadow-[0_1px_0_rgba(255,255,255,0.12)_inset]'
          : 'border border-white/[0.11] bg-white/[0.04] px-8 py-4 text-white/75 hover:text-white',
        className
      )}
      animate={
        isPrimary
          ? {
              boxShadow: hovered
                ? '0 0 60px rgba(139,92,246,0.80), 0 0 120px rgba(139,92,246,0.32), 0 4px 24px rgba(59,130,246,0.24)'
                : '0 0 40px rgba(139,92,246,0.48), 0 0 80px rgba(139,92,246,0.16), 0 4px 16px rgba(59,130,246,0.10)',
            }
          : {}
      }
    >
      {/* ── Animated gradient border ring (primary only) ── */}
      {isPrimary && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[1px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #22d3ee, #8b5cf6)',
            backgroundSize: '200% 200%',
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}

      {/* ── Shimmer sweep ── */}
      {isPrimary && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -skew-x-[14deg] bg-gradient-to-r from-transparent via-white/[0.18] to-transparent"
          initial={{ x: '-120%' }}
          animate={hovered ? { x: '220%' } : { x: '-120%' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
      )}

      {/* ── Secondary hover bg lift ── */}
      {!isPrimary && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.07), rgba(59,130,246,0.05))',
          }}
        />
      )}

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
