// app/(dashboard)/dashboard/page.tsx
'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, CreditCard, Users, ArrowRight, TrendingUp } from 'lucide-react';
import   PageWrapper          from '@/components/shared/PageWrapper';
import { DashboardSkeleton }  from '@/components/shared/DashboardSkeleton';
import { Card }               from '@/components/ui/Card';
import { Button }             from '@/components/ui/Button';
import { Badge }              from '@/components/ui/Badge';
import { Modal }              from '@/components/ui/Modal';
import { Section }            from '@/components/ui/section';
import { Skeleton }           from '@/components/ui/Skeleton';
import { InlineStatus }       from '@/components/shared/State';
import { Stats }              from '@/modules/dashboard/components/Stats';
import { RevenueChart }       from '@/modules/dashboard/components/RevenueChart';
import { useRecentAdmissions } from '@/modules/dashboard/hooks/useDashboard';
import { StudentForm }        from '@/modules/student/components/StudentForm';
import { UsageWidget }        from '@/modules/billing/components/UsageWidget';
import { useUsageSummary, useActiveStudentCount } from '@/modules/billing/hooks/useBilling';
import { useAuthStore }       from '@/store/auth.store';
import { fadeUp, staggerContainer, EASE_OUT } from '@/lib/motion';
import { theme }              from '@/styles/theme';
import { cn }                 from '@/lib/utils';
import Link from 'next/link';
import { ROUTES }             from '@/config/routes';

// ─── Quick actions ────────────────────────────────────────────────────────────
// Three most common institute tasks — reachable in one click from the dashboard.

const QUICK_ACTIONS = [
  {
    icon:    Plus,
    label:   'Add Student',
    sub:     'Enrol a new student instantly',
    color:   theme.colors.violet[500],
    action:  'add_student' as const,
  },
  {
    icon:    MessageSquare,
    label:   'Send Message',
    sub:     'SMS, WhatsApp or email',
    color:   theme.colors.emerald[400],
    href:    ROUTES.communication,
  },
  {
    icon:    CreditCard,
    label:   'Record Fee',
    sub:     'Mark a payment as received',
    color:   theme.colors.blue[400],
    href:    ROUTES.fees,
  },
] as const;

function QuickActions({ onAddStudent }: { onAddStudent: () => void }) {
  return (
    <motion.div
      className="grid grid-cols-3 gap-3"
      variants={staggerContainer(0.06, 0.04)}
      initial="hidden"
      animate="visible"
    >
      {QUICK_ACTIONS.map(({ icon: Icon, label, sub, color, ...rest }) => {
        const inner = (
          <motion.div
            variants={fadeUp}
            className="flex cursor-pointer flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.026] p-4 transition-colors duration-150 hover:bg-white/[0.04] hover:border-white/[0.12]"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            onClick={'action' in rest ? onAddStudent : undefined}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: `${color}18`, color }}
              aria-hidden
            >
              <Icon size={17} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white/85">{label}</p>
              <p className="mt-0.5 text-[11.5px] text-white/36">{sub}</p>
            </div>
          </motion.div>
        );

        return 'href' in rest
          ? <Link key={label} href={rest.href}>{inner}</Link>
          : <div key={label}>{inner}</div>;
      })}
    </motion.div>
  );
}

// ─── Usage snapshot ───────────────────────────────────────────────────────────
// Compact inline view of the most-used limits. Promotes awareness without
// forcing users to navigate to the Billing page for routine status checks.

function UsageSnapshot() {
  const { summary, limits, isLoading } = useUsageSummary();
  const { data: count } = useActiveStudentCount();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[80, 60, 45].map((w, i) => (
          <div key={i}>
            <Skeleton className={`mb-1 h-3 w-${w === 80 ? '28' : w === 60 ? '20' : '16'}`} />
            <Skeleton className="h-[4px] w-full rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!summary || !limits) return null;

  const rows = [
    { key: 'sms' as const,             label: 'SMS',         unit: 'msg' },
    { key: 'whatsappUtility' as const, label: 'WhatsApp',    unit: 'msg' },
    { key: 'emails' as const,          label: 'Email',       unit: 'emails' },
  ];

  const anyWarning = rows.some(r => summary[r.key].status !== 'ok');

  return (
    <div className="space-y-3">
      {/* Student context — the number that drives all limits */}
      {count != null && (
        <p className="text-[11.5px] text-white/32">
          Limits based on{' '}
          <span className="font-semibold text-white/60">
            {count} active student{count !== 1 ? 's' : ''}
          </span>
          {limits.isAnnual && ' (+10% annual bonus)'}
        </p>
      )}

      {rows.map(({ key, label, unit }) => {
        const s = summary[key];
        const pct = s.pct;
        const color =
          s.status === 'exceeded' ? theme.colors.rose[400]
          : s.status === 'warning' ? theme.colors.amber[400]
          : theme.colors.violet[500];

        return (
          <div key={key} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/50">{label}</span>
              <span className={cn(
                'text-[11px] font-semibold tabular-nums',
                s.status === 'exceeded' ? 'text-rose-400'
                : s.status === 'warning' ? 'text-amber-400'
                : 'text-white/36',
              )}>
                {s.used.toLocaleString()} / {s.limit.toLocaleString()}
              </span>
            </div>
            <div className="h-[4px] w-full overflow-hidden rounded-full bg-white/[0.05]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.1 }}
              />
            </div>
          </div>
        );
      })}

      {anyWarning && (
        <Link
          href={ROUTES.billing as string}
          className="flex items-center gap-1 text-[11.5px] text-violet-400 hover:text-violet-300 transition-colors"
        >
          View all limits <ArrowRight size={11} />
        </Link>
      )}
    </div>
  );
}

// ─── Recent admissions feed ───────────────────────────────────────────────────

function RecentAdmissions() {
  const { data = [], isLoading } = useRecentAdmissions();

  if (isLoading) {
    return (
      <div className="space-y-3 pt-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="flex-1">
              <Skeleton className="mb-1 h-3 w-28" />
              <Skeleton className="h-2.5 w-20" />
            </div>
            <Skeleton className="h-5 w-14 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <Users size={20} className="text-white/18" aria-hidden />
        <p className="text-[12.5px] text-white/30">
          No admissions yet this month
        </p>
        <p className="text-[11.5px] text-white/20">
          New students will appear here
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-1"
      variants={staggerContainer(0.05, 0.04)}
      initial="hidden"
      animate="visible"
    >
      {data.map((s, i) => (
        <motion.div
          key={i}
          variants={fadeUp}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-white/[0.04]"
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ background: `${theme.colors.violet[600]}55` }}
            aria-hidden
          >
            {s.name[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-white/82">{s.name}</p>
            <p className="truncate text-[11px] text-white/32">{s.course} · {s.time}</p>
          </div>
          <Badge
            variant={s.status === 'Enrolled' ? 'success' : 'warning'}
            size="sm"
          >
            {s.status}
          </Badge>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const user             = useAuthStore(s => s.user);
  const [addOpen, setAddOpen] = useState(false);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <PageWrapper>
      <Suspense fallback={<DashboardSkeleton />}>

        {/* ── Greeting ────────────────────────────────────────────────────── */}
        <motion.div
          className="mb-6"
          variants={fadeUp} initial="hidden" animate="visible"
        >
          <h1 className="text-[22px] font-bold tracking-[-0.03em] text-white">
            {greeting}{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="mt-1 text-[13.5px] text-white/40">
            Here is your institute at a glance.
          </p>
        </motion.div>

        {/* ── TIER 1 — Primary metrics ─────────────────────────────────────── */}
        <Section>
          <Stats />
        </Section>

        {/* ── Quick actions ────────────────────────────────────────────────── */}
        <Section className="mt-4">
          <QuickActions onAddStudent={() => setAddOpen(true)} />
        </Section>

        {/* ── TIER 2 — Chart + secondary panels ───────────────────────────── */}
        <Section className="mt-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

            {/* Revenue chart — widest column */}
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>

            {/* Right column: recent admissions + usage snapshot */}
            <div className="flex flex-col gap-4">

              {/* Recent admissions */}
              <Card className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold text-white">Recent admissions</h3>
                  <Link
                    href={ROUTES.students}
                    className="text-[12px] text-white/32 hover:text-white/60 transition-colors"
                  >
                    View all →
                  </Link>
                </div>
                <RecentAdmissions />
              </Card>

              {/* TIER 3 — Usage snapshot (awareness, not action) */}
              <Card className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold text-white">This month is usage</h3>
                  <Link
                    href={ROUTES.billing as string}
                    className="text-[12px] text-white/32 hover:text-white/60 transition-colors"
                  >
                    Details →
                  </Link>
                </div>
                <UsageSnapshot />
              </Card>

            </div>
          </div>
        </Section>

        {/* Add student modal */}
        <Modal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          title="Add a student"
          size="md"
        >
          <p className="mb-5 text-[13px] text-white/42">
            Fill in the details below. The student can be enrolled immediately.
          </p>
          <StudentForm onSuccess={() => setAddOpen(false)} />
        </Modal>

      </Suspense>
    </PageWrapper>
  );
}
