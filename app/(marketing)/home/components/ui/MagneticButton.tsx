'use client';

import { ReactNode, useRef, useState, MouseEvent as RMouseEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DUR, EASE, SPRING } from '@/lib/motionSystem';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MagneticButtonProps {
  children:     ReactNode;
  variant?:     'primary' | 'outline';
  className?:   string;
  onClick?:     () => void;
  /** Show loading spinner — disables clicks, plays subtle scale-down */
  loading?:     boolean;
  /** Accessibility label for screen readers during loading */
  loadingLabel?:string;
  /** Show a success checkmark after loading resolves */
  success?:     boolean;
}

// ─── Ripple ───────────────────────────────────────────────────────────────────

interface RippleItem { id: number; x: number; y: number; }

// ─── Component ────────────────────────────────────────────────────────────────

export default function MagneticButton({
  children,
  variant       = 'primary',
  className,
  onClick,
  loading       = false,
  loadingLabel  = 'Loading…',
  success       = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  // Device capability — ref, not state: value is read-only after mount,
  // never drives rendering, so no state (and no effect) is needed.
  // useRef(() => ...) lazy init runs only on the client — safe for SSR
  // because matchMedia is only accessed if typeof window !== 'undefined'.
  const canHoverRef = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(hover: hover)').matches
      : false,
  );
  const canHover = canHoverRef.current;

  // Interaction state
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  // ── Magnetic follow ───────────────────────────────────────────────────────
  // rawX/Y: pointer offset from button centre
  // x/y:    spring-smoothed (physically correct response, not CSS transition)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { damping: 22, stiffness: 340, mass: 0.35 });
  const y = useSpring(rawY, { damping: 22, stiffness: 340, mass: 0.35 });

  // ── Glow expansion ────────────────────────────────────────────────────────
  // Track pointer position inside the button for the spotlight glow
  const glowX = useMotionValue(50); // % of width
  const glowY = useMotionValue(50); // % of height

  const onMouseMove = (e: RMouseEvent<HTMLButtonElement>) => {
    if (!canHover || loading) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set((e.clientX - (rect.left + rect.width  / 2)) * 0.36);
    rawY.set((e.clientY - (rect.top  + rect.height / 2)) * 0.36);
    glowX.set(((e.clientX - rect.left) / rect.width)  * 100);
    glowY.set(((e.clientY - rect.top)  / rect.height) * 100);
  };

  const onMouseEnter = () => { if (canHover) setHovered(true); };
  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    glowX.set(50);
    glowY.set(50);
    setHovered(false);
  };

  // ── Ripple ────────────────────────────────────────────────────────────────
  const onMouseDown = (e: RMouseEvent<HTMLButtonElement>) => {
    setPressed(true);
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const id = Date.now();
    setRipples(prev => [...prev, {
      id,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }]);
    // Auto-remove ripple after animation
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700);
  };

  const isPrimary = variant === 'primary';

  // ── Glow shadow (primary only) ────────────────────────────────────────────
  const primaryShadow = {
    rest:  '0 0 44px rgba(139,92,246,0.52), 0 0 88px rgba(139,92,246,0.18), 0 4px 18px rgba(59,130,246,0.12)',
    hover: '0 0 70px rgba(139,92,246,0.88), 0 0 140px rgba(139,92,246,0.36), 0 8px 32px rgba(59,130,246,0.28)',
    press: '0 0 28px rgba(139,92,246,0.40)',
  };

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={() => setPressed(false)}
      onClick={loading || success ? undefined : onClick}
      disabled={loading}
      aria-label={loading ? loadingLabel : undefined}
      animate={{
        scale: loading ? 0.97
          : pressed  ? 0.95
          : hovered  ? 1.055
          : 1,
        ...(isPrimary && {
          boxShadow: pressed
            ? primaryShadow.press
            : hovered
            ? primaryShadow.hover
            : primaryShadow.rest,
        }),
      }}
      transition={{
        scale:     { duration: DUR.MICRO,  ease: EASE.out },
        boxShadow: { duration: DUR.FAST,   ease: EASE.out },
      }}
      className={cn(
        'group relative inline-flex cursor-pointer select-none items-center justify-center gap-2',
        'overflow-hidden rounded-full text-[14px] font-semibold tracking-[-0.01em]',
        isPrimary
          ? 'bg-gradient-to-r from-violet-600 via-violet-500 to-blue-600 px-8 py-4 text-white shadow-[0_1px_0_rgba(255,255,255,0.14)_inset,0_0_0_1px_rgba(139,92,246,0.22)]'
          : 'border border-white/[0.11] bg-white/[0.04] px-8 py-4 text-white/75 hover:text-white',
        loading && 'cursor-wait',
        className,
      )}
    >
      {/* ── Spotlight glow — follows the pointer inside the button (primary) ── */}
      {isPrimary && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle 80px at ${glowX.get()}% ${glowY.get()}%, rgba(255,255,255,0.14) 0%, transparent 70%)`,
          }}
        />
      )}

      {/* ── Animated gradient border ring (primary, hover only) ── */}
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

      {/* ── Shimmer sweep — fires once on hover enter (primary) ── */}
      {isPrimary && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -skew-x-[14deg] bg-gradient-to-r from-transparent via-white/[0.18] to-transparent"
          initial={{ x: '-130%' }}
          animate={hovered ? { x: '230%' } : { x: '-130%' }}
          transition={{ duration: 0.52, ease: EASE.out }}
        />
      )}

      {/* ── Secondary hover tint ── */}
      {!isPrimary && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: DUR.MICRO }}
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.05))',
          }}
        />
      )}

      {/* ── Click ripples ── */}
      {ripples.map(r => (
        <span
          key={r.id}
          aria-hidden="true"
          className="pointer-events-none absolute block rounded-full bg-white/20"
          style={{
            width: 6,
            height: 6,
            left: r.x - 3,
            top:  r.y - 3,
            animation: 'ripple 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        />
      ))}

      {/* ── Content: loading / success / idle ── */}
      <span className="relative z-10 flex items-center gap-2">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.span
              key="loading"
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{    opacity: 0, scale: 0.85 }}
              transition={{ duration: DUR.FAST }}
            >
              <Loader2 size={14} className="animate-spin opacity-80" />
              <span className="opacity-70">Setting up…</span>
            </motion.span>
          ) : success ? (
            <motion.span
              key="success"
              className="flex items-center gap-2 text-emerald-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{    opacity: 0, scale: 0.8 }}
              transition={{ ...SPRING.normal }}
            >
              {/* Checkmark — drawn with SVG so it can be path-animated */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <motion.path
                  d="M2 7l3.5 3.5L12 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.38, ease: EASE.out }}
                />
              </svg>
              Done!
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              className="flex items-center gap-2"
              animate={{ x: hovered ? 1 : 0 }}
              transition={{ duration: DUR.MICRO, ease: EASE.out }}
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {/* Global ripple keyframe — injected once */}
      <style>{`
        @keyframes ripple {
          from { transform: scale(1);  opacity: 0.55; }
          to   { transform: scale(28); opacity: 0; }
        }
      `}</style>
    </motion.button>
  );
}
