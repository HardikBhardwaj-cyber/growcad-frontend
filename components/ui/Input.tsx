// components/ui/Input.tsx
'use client';

import {
  InputHTMLAttributes,
  forwardRef,
  ReactNode,
  useId,
  useState,
} from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EASE_OUT } from '@/lib/motion';
import { theme } from '@/styles/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:    string;
  error?:    string;
  hint?:     string;
  icon?:     ReactNode;
  iconRight?: ReactNode;
}

// ─── Duration constants from theme ────────────────────────────────────────────

const DUR_MICRO    = theme.duration.micro;    // 0.18 — focus ring
const DUR_STANDARD = theme.duration.standard; // 0.28 — border, bg

// ─── Error shake keyframes ────────────────────────────────────────────────────
// 3px left/right, 3 cycles, 200ms — matches design spec exactly.

const shakeVariants: Variants = {
  idle: {
    x: 0,
  },
  shake: {
    x: [0, -3, 3, -3, 3, -2, 2, 0],
    transition: {
      duration: 0.38,
      ease: "easeInOut", // ✅ now valid
    },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      iconRight,
      className,
      id: idProp,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const uid               = useId();
    const id                = idProp ?? uid;
    const [focused, setFocused] = useState(false);

    const hasError = Boolean(error);

    // ── Inner wrapper classes ──────────────────────────────────────────────────
    // Mirrors theme.shadows.focusRing via Tailwind arbitrary value.
    // Background lightens to surfaceMid on focus (theme.colors.surfaceMid).

    const wrapperClass = cn(
      // Group — so icon and label can react to focus-within
      'group relative flex items-center gap-2.5 rounded-xl border px-4 py-3',
      // Smooth transition on border, background, shadow
      'transition-[border-color,background-color,box-shadow]',
      `duration-[${Math.round(DUR_STANDARD * 1000)}ms]`,
      // Rest state
      !hasError && !focused && 'border-white/[0.09] bg-white/[0.03]',
      // Focused state — violet ring from theme.shadows.focusRing
      !hasError && focused && [
        'border-violet-500/45',
        'bg-white/[0.055]',
        'shadow-[0_0_0_3px_rgba(139,92,246,0.13)]',
      ],
      // Error state — rose border, override focus if both active
      hasError && !focused && 'border-rose-500/55 bg-white/[0.03]',
      hasError && focused  && [
        'border-rose-500/55',
        'bg-white/[0.03]',
        'shadow-[0_0_0_3px_rgba(251,113,133,0.14)]',
      ],
    );

    // ── Label colour — brighter when focused ───────────────────────────────────
    const labelClass = cn(
      'block text-[12px] font-medium transition-colors duration-[180ms]',
      // Rest: white/42. Focused: white/65.
      focused ? 'text-white/65' : 'text-white/42',
      hasError && 'text-rose-400/80',
    );

    return (
      <div className="flex flex-col gap-1.5">
        {/* Label */}
        {label && (
          <label htmlFor={id} className={labelClass}>
            {label}
          </label>
        )}

        {/* Field row — shake on error */}
        <motion.div
          variants={shakeVariants}
          animate={hasError ? 'shake' : 'idle'}
          className={wrapperClass}
        >
          {/* Left icon — brighter on focus */}
          {icon && (
            <span
              className={cn(
                'shrink-0 transition-colors duration-[180ms]',
                focused ? 'text-white/42' : 'text-white/24',
                hasError && 'text-rose-400/60',
              )}
            >
              {icon}
            </span>
          )}

          {/* Input element */}
          <input
            ref={ref}
            id={id}
            className={cn(
              'min-w-0 flex-1 bg-transparent text-[13.5px] text-white outline-none',
              'placeholder:text-white/20',
              'caret-violet-400',
              className,
            )}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${id}-error` : hint ? `${id}-hint` : undefined
            }
            {...props}
          />

          {/* Right icon */}
          {iconRight && (
            <span
              className={cn(
                'shrink-0 transition-colors duration-[180ms]',
                focused ? 'text-white/42' : 'text-white/24',
              )}
            >
              {iconRight}
            </span>
          )}
        </motion.div>

        {/* Feedback — error or hint, never both */}
        <AnimatePresence mode="wait" initial={false}>
          {hasError ? (
            <motion.p
              key="error"
              id={`${id}-error`}
              role="alert"
              className="text-[11.5px] text-rose-400"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0, transition: { duration: DUR_MICRO, ease: "easeOut" } }}
              exit={{   opacity: 0, y: -4, transition: { duration: DUR_MICRO, ease: "easeInOut" } }}
            >
              {error}
            </motion.p>
          ) : hint ? (
            <motion.p
              key="hint"
              id={`${id}-hint`}
              className="text-[11.5px] text-white/30"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0, transition: { duration: DUR_MICRO, ease: "easeOut" } }}
              exit={{   opacity: 0, y: -4, transition: { duration: DUR_MICRO, ease: "easeInOut" } }}
            >
              {hint}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  },
);

Input.displayName = 'Input';
