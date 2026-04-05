'use client';

import { InputHTMLAttributes, forwardRef, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:       string;
  error?:       string;
  hint?:        string;
  icon?:        ReactNode;
  iconRight?:   ReactNode;
  success?:     boolean;
  maxChars?:    number;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  icon,
  iconRight,
  success  = false,
  maxChars,
  className,
  value,
  onChange,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const charCount = typeof value === 'string' ? value.length : 0;

  const borderColor = error
    ? 'border-rose-500/55 focus:border-rose-500/70'
    : success
    ? 'border-emerald-500/55 focus:border-emerald-500/70'
    : 'border-white/[0.09] hover:border-white/[0.16] focus:border-violet-500/50';

  const glowColor = error
    ? 'focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)]'
    : success
    ? 'focus:shadow-[0_0_0_3px_rgba(16,185,129,0.12)]'
    : 'focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]';

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      {label && (
        <label
          className={cn(
            'text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200',
            focused ? 'text-violet-400' : 'text-white/30'
          )}
        >
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Left icon */}
        {icon && (
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/28">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            'w-full rounded-xl border bg-white/[0.030] px-4 py-3 text-[14px] text-white',
            'placeholder:text-white/20 outline-none',
            'transition-all duration-250',
            borderColor,
            glowColor,
            icon      && 'pl-10',
            iconRight && 'pr-10',
            className
          )}
          {...props}
        />

        {/* Right icon / success check / error x */}
        {(iconRight || success || error) && (
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-white/28">
            {error   ? <span className="text-rose-400 text-sm">✕</span>
            : success ? <span className="text-emerald-400 text-sm">✓</span>
            : iconRight}
          </div>
        )}
      </div>

      {/* Footer row */}
      <div className="flex items-start justify-between gap-2">
        {/* Error / hint */}
        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              key="error"
              className="text-[11px] text-rose-400"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          ) : hint ? (
            <motion.p
              key="hint"
              className="text-[11px] text-white/25"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {hint}
            </motion.p>
          ) : <span />}
        </AnimatePresence>

        {/* Character counter */}
        {maxChars && (
          <p className={cn(
            'ml-auto flex-shrink-0 text-[11px] tabular-nums transition-colors duration-200',
            charCount > maxChars * 0.9 ? 'text-amber-400/70' : 'text-white/18',
            charCount >= maxChars      && 'text-rose-400/80',
          )}>
            {charCount}/{maxChars}
          </p>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
