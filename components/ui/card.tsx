// components/ui/Card.tsx
// Phase 7.5: subtle tilt on hover (rotateX/Y via mouse position).

'use client';

import {
  motion,
  useMotionValue, useSpring, useMotionTemplate, useTransform,
  type HTMLMotionProps,
} from 'framer-motion';
import { ReactNode, useRef, MouseEvent as RMouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { scaleIn, EASE_OUT, EASE_SOFT, SPRING_SOFT } from '@/lib/motion';
import { theme } from '@/styles/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children:    ReactNode;
  hoverable?:  boolean;  // enables lift + cursor glow + tilt
  reveal?:     boolean;  // animate in on mount
  delay?:      number;   // stagger delay
  glowAccent?: string;   // rgba accent for cursor glow
  deep?:       boolean;  // dashCard shadow depth
  className?:  string;
}

// ─── Shadow tokens ────────────────────────────────────────────────────────────

const SHADOW_REST = theme.shadows.card;
const SHADOW_LIFT = theme.shadows.cardLift;
const SHADOW_DEEP = theme.shadows.dashCard;
const DUR_MICRO    = theme.duration.micro;
const DUR_STANDARD = theme.duration.standard;

// ─── Component ────────────────────────────────────────────────────────────────

export function Card({
  children,
  hoverable  = false,
  reveal     = false,
  delay      = 0,
  glowAccent = 'rgba(139,92,246,0.09)',
  deep       = false,
  className,
  ...props
}: CardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // ── Cursor radial glow — zero re-renders ─────────────────────────────────────
  const hlX  = useMotionValue(50);
  const hlY  = useMotionValue(50);
  const sHlX = useSpring(hlX, { damping: 28, stiffness: 200, mass: 0.4 });
  const sHlY = useSpring(hlY, { damping: 28, stiffness: 200, mass: 0.4 });

  const highlightBg = useMotionTemplate`radial-gradient(
    180px circle at ${sHlX}% ${sHlY}%,
    ${glowAccent},
    transparent 80%
  )`;

  // ── Border brightness ─────────────────────────────────────────────────────────
  const borderOpacity  = useMotionValue(0.07);
  const sBorderOpacity = useSpring(borderOpacity, { damping: 28, stiffness: 220, mass: 0.35 });
  const borderColor    = useMotionTemplate`rgba(255,255,255,${sBorderOpacity})`;

  // ── Subtle tilt — Phase 7.5 ───────────────────────────────────────────────────
  // Maps cursor position (0–100%) to ±3deg rotation.
  // Spring-smoothed so movement feels physical, not mechanical.
  // Bounded: maxRotate 3deg — enough to convey depth without nausea.
  const maxRotate = 2.5; // degrees
  const rawRX = useMotionValue(0);
  const rawRY = useMotionValue(0);
  const rotateX = useSpring(rawRX, SPRING_SOFT);
  const rotateY = useSpring(rawRY, SPRING_SOFT);

  // ── Mouse handlers ────────────────────────────────────────────────────────────
  const onMouseMove = (e: RMouseEvent<HTMLDivElement>) => {
    if (!hoverable) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x    = (e.clientX - rect.left)  / rect.width;
    const y    = (e.clientY - rect.top)   / rect.height;

    hlX.set(x * 100);
    hlY.set(y * 100);

    // Tilt: cursor above center → tilt up (positive rotateX), left → tilt left
    rawRY.set((x - 0.5) * maxRotate * 2);
    rawRX.set((0.5 - y) * maxRotate * 2);
  };

  const onMouseEnter = () => {
    if (!hoverable) return;
    borderOpacity.set(0.14);
  };

  const onMouseLeave = () => {
    if (!hoverable) return;
    hlX.set(50);
    hlY.set(50);
    borderOpacity.set(0.07);
    rawRX.set(0);
    rawRY.set(0);
  };

  const entryProps = reveal
    ? {
        variants:   scaleIn,
        initial:    'hidden' as const,
        animate:    'visible' as const,
        transition: { duration: DUR_STANDARD, delay, ease: EASE_OUT },
      }
    : {};

  const hoverProps = hoverable
    ? {
        whileHover: {
          y:         -4,
          boxShadow: SHADOW_LIFT,
        },
        whileTap: { scale: 0.988 },
        transition: {
          y:         { duration: DUR_STANDARD, ease: EASE_SOFT },
          boxShadow: { duration: DUR_STANDARD, ease: EASE_SOFT },
          scale:     { duration: DUR_MICRO,    ease: EASE_OUT  },
        },
      }
    : {};

  return (
    <motion.div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'backdrop-blur-[10px]',
        className,
      )}
      style={{
        border:     '1px solid',
        borderColor,
        background: theme.colors.surface,
        boxShadow:  deep ? SHADOW_DEEP : SHADOW_REST,
        // Tilt — only active when hoverable
        rotateX:    hoverable ? rotateX : 0,
        rotateY:    hoverable ? rotateY : 0,
        transformStyle: 'preserve-3d',
        willChange: hoverable ? 'transform, box-shadow' : undefined,
      }}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...entryProps}
      {...hoverProps}
      {...props}
    >
      {/* ── Top-edge light ─────────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
        }}
      />

      {/* ── Corner catch-light ─────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 40%, transparent 65%)',
        }}
      />

      {/* ── Cursor radial highlight ─────────────────────────────────────────── */}
      {hoverable && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: highlightBg }}
        />
      )}

      {children}
    </motion.div>
  );
}
