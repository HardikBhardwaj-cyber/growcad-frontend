// components/ui/Button.tsx
// Phase 7.5: spring physics on press, ripple on click, no hardcoded values.

'use client';

import {
  motion, type HTMLMotionProps, AnimatePresence,
} from 'framer-motion';
import {
  ReactNode, useRef, useState, useEffect,
  useCallback, MouseEvent as RMouseEvent,
} from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EASE_OUT, EASE_SOFT, SPRING_SNAPPY } from '@/lib/motion';
import { theme } from '@/styles/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children:     ReactNode;
  variant?:     'primary' | 'secondary' | 'ghost' | 'danger';
  size?:        'sm' | 'md' | 'lg';
  loading?:     boolean;
  fullWidth?:   boolean;
  loadingText?: string;
}

// ─── Duration constants from theme ────────────────────────────────────────────

const DUR_MICRO    = theme.duration.micro;     // 0.18
const DUR_STANDARD = theme.duration.standard;  // 0.28

// ─── Shimmer — left→right sweep ───────────────────────────────────────────────

function Shimmer({ active }: { active: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-0 -skew-x-[14deg] bg-gradient-to-r from-transparent via-white/[0.20] to-transparent"
      initial={{ x: '-130%' }}
      animate={active ? { x: '230%' } : { x: '-130%' }}
      transition={{ duration: 0.48, ease: EASE_OUT }}
    />
  );
}

// ─── Gradient border ring ─────────────────────────────────────────────────────

function GlowBorder({ active }: { active: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute -inset-px rounded-full"
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: DUR_STANDARD, ease: EASE_SOFT }}
      style={{
        background: theme.gradients.text,
        backgroundSize: '200% 200%',
        WebkitMask:
          'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        padding: '1px',
      }}
    />
  );
}

function SecondaryFill({ active }: { active: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-full"
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: DUR_MICRO }}
      style={{
        background:
          'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.05))',
      }}
    />
  );
}

// ─── Ripple — radial expand from click position ────────────────────────────────
// Communicates "this action registered" with a physical, tactile feel.
// Completes in 420ms — noticeable but not disruptive.

interface RippleItem { id: number; x: number; y: number; }

function Ripples({ ripples }: { ripples: RippleItem[] }) {
  return (
    <>
      {ripples.map(r => (
        <motion.span
          key={r.id}
          aria-hidden
          className="pointer-events-none absolute rounded-full bg-white/10"
          style={{ width: 4, height: 4, left: r.x - 2, top: r.y - 2 }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 28, opacity: 0 }}
          transition={{ duration: 0.42, ease: EASE_OUT }}
        />
      ))}
    </>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Button({
  children,
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  fullWidth = false,
  loadingText,
  className,
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const ref    = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const [canHover, setCanHover] = useState(false);
  const rippleId = useRef(0);

  useEffect(() => {
  const mq = window.matchMedia('(hover: hover)');
  
  const update = () => setCanHover(mq.matches);

  update(); // initial

  mq.addEventListener('change', update);
  return () => mq.removeEventListener('change', update);
}, []);

  const isPrimary   = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost     = variant === 'ghost';
  const isDanger    = variant === 'danger';
  const isDisabled  = disabled || loading;

  // Ripple: spawn on click, auto-remove after animation completes
  const handleClick = useCallback(
    (e: RMouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return;
      const el   = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const x    = e.clientX - rect.left;
        const y    = e.clientY - rect.top;
        const id   = ++rippleId.current;
        setRipples(rs => [...rs, { id, x, y }]);
        setTimeout(() => setRipples(rs => rs.filter(r => r.id !== id)), 450);
      }
      onClick?.(e);
    },
    [isDisabled, onClick],
  );

  // Shadow tokens — never inlined
  const primaryShadowRest  = theme.shadows.glowV;
  const primaryShadowHover = theme.shadows.glowVHover;

  return (
    <motion.button
      ref={ref}
      className={cn(
        'relative inline-flex items-center justify-center gap-2',
        'select-none overflow-hidden rounded-full font-semibold',
        'cursor-pointer',
        size === 'sm' && 'px-4 py-2 text-[12.5px] tracking-[-0.01em]',
        size === 'md' && 'px-6 py-2.5 text-[13.5px] tracking-[-0.01em]',
        size === 'lg' && 'px-8 py-3.5 text-[14.5px] tracking-[-0.01em]',
        isPrimary && [
          'bg-gradient-to-r from-violet-600 via-violet-500 to-blue-600 text-white',
          'shadow-[0_0_28px_rgba(139,92,246,0.28)]',
          'transition-shadow',
        ],
        isSecondary && [
          'border border-white/[0.12] bg-white/[0.04] text-white/80',
          'transition-[background,border-color,color]',
          hovered && !isDisabled && 'border-white/[0.22] bg-white/[0.08] text-white',
        ],
        isGhost && [
          'text-white/48 transition-colors',
          hovered && !isDisabled && 'text-white/90',
        ],
        isDanger && [
          'border border-rose-500/30 bg-rose-500/15 text-rose-400',
          'transition-[background,box-shadow]',
          hovered && !isDisabled && 'bg-rose-500/25',
        ],
        fullWidth  && 'w-full',
        isDisabled && 'pointer-events-none opacity-50',
        className,
      )}
      // Phase 7.5: press uses spring physics — physical "click" feel
      animate={{
        scale:
          pressed ? 0.975
          : hovered && !isDisabled
            ? isPrimary ? 1.03 : 1.02
            : 1,
        y: hovered && !isDisabled && !pressed ? -2 : 0,
        ...(isPrimary && {
          boxShadow:
            hovered && !isDisabled ? primaryShadowHover : primaryShadowRest,
        }),
      }}
      transition={{
        // Spring on scale/y — makes press feel physical
        // type:'spring' physics: stiffness=500, damping=30
        scale: pressed
          ? { type: 'spring', stiffness: 500, damping: 30, mass: 0.6 }
          : { duration: DUR_MICRO, ease: EASE_OUT },
        y:         { duration: DUR_MICRO,    ease: EASE_OUT  },
        boxShadow: { duration: DUR_STANDARD, ease: EASE_SOFT },
      }}
      onMouseEnter={() => { if (canHover) setHovered(true); }}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={handleClick}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {isPrimary   && <GlowBorder    active={hovered && !isDisabled} />}
      {isPrimary   && <Shimmer       active={hovered && !isDisabled} />}
      {isSecondary && <SecondaryFill active={hovered && !isDisabled} />}

      {/* Ripples */}
      <Ripples ripples={ripples} />

      {/* Loading spinner */}
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.span
            key="spinner"
            className="absolute inset-0 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR_MICRO, ease: EASE_OUT }}
          >
            <Loader2
              size={size === 'sm' ? 13 : size === 'lg' ? 16 : 14}
              className="animate-spin"
            />
            {loadingText && <span className="text-[inherit]">{loadingText}</span>}
          </motion.span>
        ) : null}
      </AnimatePresence>

      {/* Label */}
      <motion.span
        className="relative z-10 flex items-center gap-2"
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: DUR_MICRO, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}
