'use client';

import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { ReactNode, useRef, MouseEvent as RMouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { T, SHADOW } from '../../systems/design';

interface GlassCardProps {
  children:   ReactNode;
  className?: string;
  tilt?:      boolean;
  glow?:      boolean;
  glowColor?: string;
  lift?:      boolean;
  /** Extra depth — makes card look like it sits in a deeper well */
  deep?:      boolean;
}

/**
 * Cards must feel like "floating surfaces in space" — not flat boxes.
 *
 * Depth system:
 *  1. Multi-layer box-shadow (ambient + contact shadow + depth shadow)
 *  2. Top-edge light reflection (as if light comes from above)
 *  3. Moving cursor highlight (useMotionTemplate — reactive, no .get() bug)
 *  4. Gradient border glow on hover
 *  5. Spring-physics tilt with depth-preserving perspective
 *  6. Scale + shadow intensify together on lift
 */
export default function GlassCard({
  children,
  className,
  tilt     = false,
  glow     = false,
  glowColor = 'rgba(139,92,246,0.16)',
  lift     = true,
  deep     = false,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // ── Tilt springs ─────────────────────────────────────────────────────────
  const rawRX = useMotionValue(0);
  const rawRY = useMotionValue(0);
  const rawSc = useMotionValue(1);
  const rotX  = useSpring(rawRX, { damping: 26, stiffness: 280, mass: 0.3 });
  const rotY  = useSpring(rawRY, { damping: 26, stiffness: 280, mass: 0.3 });
  const sc    = useSpring(rawSc, { damping: 26, stiffness: 280, mass: 0.3 });

  // ── Cursor highlight (reactive via useMotionTemplate) ─────────────────────
  const hlX = useMotionValue(50);
  const hlY = useMotionValue(50);
  const highlightBg = useMotionTemplate`
    radial-gradient(
      220px circle at ${hlX}% ${hlY}%,
      rgba(139,92,246,0.09),
      transparent 70%
    )
  `;

  const onMouseMove = (e: RMouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx   = (e.clientX - rect.left) / rect.width;
    const dy   = (e.clientY - rect.top)  / rect.height;

    if (tilt) {
      rawRX.set(-(dy - 0.5) * 14);
      rawRY.set( (dx - 0.5) * 14);
      rawSc.set(1.018);
    }
    hlX.set(dx * 100);
    hlY.set(dy * 100);
  };

  const onMouseLeave = () => {
    rawRX.set(0); rawRY.set(0); rawSc.set(1);
    hlX.set(50);  hlY.set(50);
  };

  // ── Shadow depth (deepens on hover) ──────────────────────────────────────
  const restShadow = deep ? SHADOW.dashCard : SHADOW.card;
  const liftShadow = SHADOW.cardLift;

  const baseClass = cn(
    'group relative overflow-hidden rounded-2xl',
    'border border-white/[0.07]',
    deep ? 'bg-[#0c0c10]/90' : 'bg-white/[0.026]',
    'p-6 backdrop-blur-[10px]',
    'transition-[border-color,box-shadow] duration-[180ms]',
    glow && 'hover:border-white/[0.12]',
    className
  );

  const decoration = (
    <>
      {/* Layer 1: Top-edge light reflection (always) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.14) 40%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.14) 60%, transparent 100%)',
        }}
      />

      {/* Layer 2: Top-left corner catch-light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 40%, transparent 65%)',
        }}
      />

      {/* Layer 3: Reactive cursor highlight (useMotionTemplate — bug-free) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: highlightBg }}
      />

      {/* Layer 4: Gradient border glow on hover */}
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
          style={{
            background: `linear-gradient(135deg, ${glowColor} 0%, transparent 55%)`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '1px',
          }}
        />
      )}

      {/* Layer 5: Bottom edge shadow (contact shadow — makes it look grounded) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 -bottom-px h-px opacity-40"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(59,130,246,0.2), transparent)',
          filter: 'blur(2px)',
        }}
      />
    </>
  );

  if (tilt) {
    return (
      <motion.div
        ref={ref}
        className={baseClass}
        style={{
          rotateX: rotX,
          rotateY: rotY,
          scale: sc,
          transformStyle: 'preserve-3d',
          boxShadow: restShadow,
          willChange: 'transform',
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        whileHover={lift ? { boxShadow: liftShadow } : undefined}
        whileTap={lift ? { scale: 0.988 } : undefined}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        {decoration}
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={baseClass}
      style={{
        boxShadow: restShadow,
        willChange: 'transform, opacity',
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={
        lift
          ? { y: -4, boxShadow: liftShadow }
          : undefined
      }
      whileTap={lift ? { scale: 0.988 } : undefined}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      {decoration}
      {children}
    </motion.div>
  );
}
