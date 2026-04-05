'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeColor = 'violet' | 'blue' | 'emerald' | 'amber' | 'rose' | 'cyan';

interface BadgeProps {
  children:  ReactNode;
  className?: string;
  dot?:      boolean;
  color?:    BadgeColor;
  size?:     'sm' | 'md';
}

const COLOR_MAP: Record<BadgeColor, { wrap: string; dot: string }> = {
  violet:  { wrap: 'border-violet-500/22  bg-violet-500/10  text-violet-300',  dot: 'bg-violet-400'  },
  blue:    { wrap: 'border-blue-500/22    bg-blue-500/10    text-blue-300',    dot: 'bg-blue-400'    },
  emerald: { wrap: 'border-emerald-500/22 bg-emerald-500/10 text-emerald-300', dot: 'bg-emerald-400' },
  amber:   { wrap: 'border-amber-500/22   bg-amber-500/10   text-amber-300',   dot: 'bg-amber-400'   },
  rose:    { wrap: 'border-rose-500/22    bg-rose-500/10    text-rose-300',    dot: 'bg-rose-400'    },
  cyan:    { wrap: 'border-cyan-500/22    bg-cyan-500/10    text-cyan-300',    dot: 'bg-cyan-400'    },
};

const SIZE_MAP: Record<'sm' | 'md', string> = {
  sm: 'px-2.5 py-[3px] text-[10px] gap-1.5',
  md: 'px-3.5  py-[5px] text-[11px] gap-2',
};

export default function Badge({
  children,
  className,
  dot   = false,
  color = 'violet',
  size  = 'md',
}: BadgeProps) {
  const { wrap, dot: dotColor } = COLOR_MAP[color];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium tracking-wide',
        wrap,
        SIZE_MAP[size],
        className
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
          {/* ping uses CSS keyframe from globals.css */}
          <span
            className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-65', dotColor)}
          />
          <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', dotColor)} />
        </span>
      )}
      {children}
    </span>
  );
}
