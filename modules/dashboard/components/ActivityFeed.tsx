// modules/dashboard/components/ActivityFeed.tsx
'use client';

import { motion } from 'framer-motion';
import { UserPlus, CreditCard, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card }     from '@/components/ui/card';
import { Badge }    from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/skeleton';
import { fadeUp, staggerContainer, EASE_OUT } from '@/lib/motion';
import { theme }    from '@/styles/theme';
import { useRecentAdmissions } from '../hooks/useDashboard';
import type { LucideIcon } from 'lucide-react';

// ─── Event types ──────────────────────────────────────────────────────────────

type EventType = 'admission' | 'payment' | 'pending' | 'resolved';

const EVENT_CONFIG: Record<EventType, { Icon: LucideIcon; color: string; label: string }> = {
  admission: { Icon: UserPlus,      color: theme.colors.violet[400], label: 'Enrolled'   },
  payment:   { Icon: CreditCard,    color: theme.colors.emerald[400],label: 'Paid'        },
  pending:   { Icon: AlertTriangle, color: theme.colors.amber[400],  label: 'Pending fee' },
  resolved:  { Icon: CheckCircle2,  color: theme.colors.emerald[400],label: 'Resolved'    },
};

function resolveType(status: string): EventType {
  if (status === 'Enrolled')    return 'admission';
  if (status === 'Fee pending') return 'pending';
  if (status === 'Paid')        return 'payment';
  return 'resolved';
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function FeedSkeleton() {
  return (
    <Card className="p-5">
      <Skeleton className="mb-4 h-4 w-36" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="mt-0.5 h-7 w-7 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="mb-1.5 h-3.5 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full flex-shrink-0" />
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function FeedEmpty() {
  return (
    <Card className="p-5">
      <h3 className="mb-4 text-[14px] font-semibold text-white">Recent Activity</h3>
      <div className="flex flex-col items-center justify-center gap-2 py-10">
        <UserPlus size={22} className="text-white/18" aria-hidden />
        <p className="text-[12.5px] text-white/28">No recent activity</p>
      </div>
    </Card>
  );
}

// ─── Single feed item ─────────────────────────────────────────────────────────

function FeedItem({
  name, course, time, status,
}: { name: string; course: string; time: string; status: string }) {
  const type   = resolveType(status);
  const config = EVENT_CONFIG[type];
  const badgeVariant: 'success' | 'warning' | 'info' =
    type === 'admission' ? 'info'
    : type === 'pending'  ? 'warning'
    : 'success';

  return (
    <motion.div
      className="flex items-start gap-3"
      variants={fadeUp}
    >
      {/* Icon bubble */}
      <div
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ background: `${config.color}18`, color: config.color }}
        aria-hidden
      >
        <config.Icon size={13} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-white/82">{name}</p>
        <p className="text-[11.5px] text-white/32">
          {course} · {time}
        </p>
      </div>

      {/* Status badge */}
      <Badge variant={badgeVariant} size="sm" className="shrink-0">
        {status}
      </Badge>
    </motion.div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export function ActivityFeed() {
  const { data = [], isLoading } = useRecentAdmissions();

  if (isLoading) return <FeedSkeleton />;
  if (data.length === 0) return <FeedEmpty />;

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-[14px] font-semibold tracking-[-0.02em] text-white">
        Recent Activity
      </h3>

      <motion.div
        className="space-y-4"
        variants={staggerContainer(0.06, 0.04)}
        initial="hidden"
        animate="visible"
      >
        {data.map((item, i) => (
          <FeedItem
            key={i}
            name={item.name}
            course={item.course}
            time={item.time}
            status={item.status}
          />
        ))}
      </motion.div>

      {data.length >= 5 && (
        <button className="mt-4 w-full rounded-xl py-2.5 text-center text-[12.5px] text-white/32 transition-colors hover:bg-white/[0.04] hover:text-white/60">
          View all activity →
        </button>
      )}
    </Card>
  );
}
