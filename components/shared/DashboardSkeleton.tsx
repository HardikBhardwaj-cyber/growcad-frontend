// components/shared/DashboardSkeleton.tsx
// Phase 5: uses shimmer Skeleton (directional sweep, not just pulse)
import { Skeleton, SkeletonText, SkeletonAvatar } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Stats row — exact grid match to real Stats component */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/[0.07] bg-white/[0.026] p-5">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <Skeleton className="mb-[6px] h-7 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Chart + feed row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Revenue chart skeleton */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.07] bg-white/[0.026] p-5">
          <div className="mb-5 flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-28" />
          </div>
          {/* Bar placeholders at varying heights */}
          <div className="flex h-[160px] items-end gap-1">
            {[55,72,45,88,62,78,50,95,68,100,80,92].map((h, i) => (
              <Skeleton
                key={i}
                className="flex-1 rounded-t-[3px]"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-2 flex-1 rounded" />
            ))}
          </div>
        </div>

        {/* Activity feed skeleton */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.026] p-5">
          <Skeleton className="mb-4 h-4 w-32" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="mb-4 flex items-start gap-3">
              <SkeletonAvatar size={28} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <Skeleton className="mb-1.5 h-3.5 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-5 w-14 rounded-full shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
