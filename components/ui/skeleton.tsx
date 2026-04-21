// components/ui/Skeleton.tsx
// Phase 7.5: style? prop added so inline heights work everywhere.

import { cn } from '@/lib/utils';
import type { CSSProperties } from 'react';

interface SkeletonProps {
  className?: string;
  circle?:    boolean;
  style?:     CSSProperties;
}

export function Skeleton({ className, circle = false, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white/[0.04]',
        'skeleton-shimmer',
        circle ? 'rounded-full' : 'rounded-xl',
        className,
      )}
      style={style}
      aria-hidden="true"
    />
  );
}

// ─── Compound variants ────────────────────────────────────────────────────────

export function SkeletonText({ className }: { className?: string }) {
  return <Skeleton className={cn('h-[13px]', className)} />;
}

export function SkeletonHeading({ className }: { className?: string }) {
  return <Skeleton className={cn('h-5', className)} />;
}

export function SkeletonAvatar({
  size = 36, className,
}: { size?: number; className?: string }) {
  return (
    <Skeleton
      circle
      className={className}
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonBadge({ className }: { className?: string }) {
  return <Skeleton className={cn('h-5 w-14 rounded-full', className)} />;
}
