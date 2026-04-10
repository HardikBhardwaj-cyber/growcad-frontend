'use client';

import { ReactNode, useRef, useState, MouseEvent as RMouseEvent, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children:   ReactNode;
  variant?:   'primary' | 'outline';
  className?: string;
  onClick?:   () => void;
}

export default function MagneticButton({
  children,
  variant  = 'primary',
  className,
  onClick,
}: MagneticButtonProps) {
  const ref      = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered]   = useState(false);
  const [pressed, setPressed]   = useState(false);
  const canHover = useRef(false);

  useEffect(() => {
    canHover.current = window.matchMedia('(hover: hover)').matches;
  }, []);

  // Magnetic follow — snappy spring, immediate response
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { damping: 20, stiffness: 320, mass: 0.3 });
  const y = useSpring(rawY, { damping: 20, stiffness: 320, mass: 0.3 });

  const onMouseMove = (e: RMouseEvent<HTMLButtonElement>) => {
    if (!canHover) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set((e.clientX - (rect.left + rect.width  / 2)) * 0.38);
    rawY.set((e.clientY - (rect.top  + rect.height / 2)) * 0.38);
  };

  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setHovered(false);
  };

  const isPrimary = variant === 'primary';

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={onClick}
      // Immediate hover response <50ms — no transition delay on scale
      animate={{
        scale: pressed ? 0.955 : hovered ? 1.06 : 1,
        y: hovered && !pressed ? -2 : 0,
        ...(isPrimary && {
          boxShadow: hovered
            ? '0 0 70px rgba(139,92,246,0.88), 0 0 140px rgba(139,92,246,0.36), 0 8px 32px rgba(59,130,246,0.28), 0 0 200px rgba(139,92,246,0.12)'
            : '0 0 44px rgba(139,92,246,0.52), 0 0 88px rgba(139,92,246,0.18), 0 4px 18px rgba(59,130,246,0.12)',
        }),
      }}
      transition={{
        scale:     { duration: 0.14, ease: [0.16, 1, 0.3, 1] },
        y:         { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
        boxShadow: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
      }}
      className={cn(
        'group relative inline-flex cursor-pointer select-none items-center justify-center gap-2',
        'overflow-hidden rounded-full text-[14px] font-semibold tracking-[-0.01em]',
        isPrimary
          ? 'bg-gradient-to-r from-violet-600 via-violet-500 to-blue-600 px-8 py-4 text-white shadow-[0_1px_0_rgba(255,255,255,0.14)_inset,0_0_0_1px_rgba(139,92,246,0.22)]'
          : 'border border-white/[0.11] bg-white/[0.04] px-8 py-4 text-white/75 hover:text-white',
        className
      )}
    >
      {/* Gradient border ring — appears on hover */}
      {isPrimary && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[1px] rounded-full opacity-0 transition-opacity duration-150 group-hover:opacity-100"
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

      {/* Shimmer sweep — fires on hover */}
      {isPrimary && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -skew-x-[14deg] bg-gradient-to-r from-transparent via-white/[0.20] to-transparent"
          initial={{ x: '-130%' }}
          animate={hovered ? { x: '230%' } : { x: '-130%' }}
          transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
        />
      )}

      {/* Secondary hover lift */}
      {!isPrimary && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.12 }}
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.05))',
          }}
        />
      )}

      {/* Children — arrow shifts right on hover (directional intent) */}
      <span className="relative z-10 flex items-center gap-2">
        <motion.span
          className="flex items-center gap-2"
          animate={{ x: hovered ? 1 : 0 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.span>
      </span>
    </motion.button>
  );
}
