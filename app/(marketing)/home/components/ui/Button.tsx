'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?:    'sm' | 'md' | 'lg';
  pulse?:   boolean;
}

const BASE =
  'relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-[background,border-color,color] disabled:pointer-events-none disabled:opacity-40';

const SIZES: Record<string, string> = {
  sm: 'px-5 py-2 text-xs',
  md: 'px-7 py-[11px] text-[13.5px]',
  lg: 'px-9 py-[14px] text-[15px]',
};

export default function Button({
  children,
  variant = 'primary',
  size    = 'md',
  pulse   = false,
  className,
  ...props
}: ButtonProps) {
  const isPrimary   = variant === 'primary';
  const isSecondary = variant === 'secondary';

  return (
    <motion.button
      className={cn(
        BASE,
        SIZES[size],
        isPrimary && [
          'bg-gradient-to-r from-violet-600 to-blue-600 text-white',
          'shadow-[0_0_28px_rgba(139,92,246,0.28)]',
          pulse && 'animate-glow-pulse',
        ],
        isSecondary && [
          'border border-white/[0.10] bg-white/[0.038] text-white/70',
          'hover:bg-white/[0.07] hover:border-white/[0.18] hover:text-white',
        ],
        variant === 'ghost' && 'text-white/48 hover:text-white/90',
        className
      )}
      whileHover={{
        scale: isPrimary ? 1.04 : 1.025,
        ...(isPrimary && {
          boxShadow: '0 0 52px rgba(139,92,246,0.55), 0 0 100px rgba(139,92,246,0.18)',
        }),
      }}
      whileTap={{ scale: 0.965 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {/* Shimmer sweep — primary only */}
      {isPrimary && (
        <span
          aria-hidden="true"
          className="animate-shimmer pointer-events-none absolute inset-0 -skew-x-[14deg] bg-gradient-to-r from-transparent via-white/[0.13] to-transparent"
          style={{ animationPlayState: 'paused' }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'running')}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
        />
      )}

      {/* Inner gradient lift on hover — secondary */}
      {isSecondary && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(59,130,246,0.04) 100%)',
          }}
        />
      )}

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
