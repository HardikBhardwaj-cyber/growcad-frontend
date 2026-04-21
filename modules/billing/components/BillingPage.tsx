// modules/billing/components/BillingPage.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Zap, CreditCard, Banknote, Calendar,
  AlertTriangle, Users, TrendingUp, ArrowRight,
} from 'lucide-react';
import { Card }      from '@/components/ui/card';
import { Button }    from '@/components/ui/Button';
import { Badge }     from '@/components/ui/Badge';
import { Modal }     from '@/components/ui/modal';
import { Skeleton }  from '@/components/ui/skeleton';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { fadeUp, staggerContainer, EASE_OUT } from '@/lib/motion';
import { theme }     from '@/styles/theme';
import { formatDate } from '@/lib/utils';
import { cn }        from '@/lib/utils';
import Link          from 'next/link';

import {
  useSubscription, useUsageSummary,
  useActiveStudentCount, useResolvedLimits,
} from '../hooks/useBilling';
import { useRazorpayUpgrade, useCashUpgrade } from '../hooks/useUpgrade';
import { UsageMeter } from './UsageMeter';
import { PLAN_ORDER, getPlan, nextPlan } from '../plans';
import type { PlanId, UsageMetricKey } from '../types';

// ─── Meter config: label + benefit-driven sub-copy ────────────────────────────
// sub: explains what each number actually means to a teacher running an institute.
type PerStudentLimits = Record<string, number>;
const METER_CONFIG: {
  key:  UsageMetricKey;
  label:string;
  unit: string;
  sub:  string; // benefit copy shown below the bar
}[] = [
  {
    key:   'sms',
    label: 'SMS messages',
    unit:  'messages',
    sub:   'Direct texts for fee reminders, exam alerts, and parent updates.',
  },
  {
    key:   'whatsappUtility',
    label: 'WhatsApp notifications',
    unit:  'messages',
    sub:   'Transactional messages like fee receipts and class schedules.',
  },
  {
    key:   'whatsappMarketing',
    label: 'WhatsApp marketing',
    unit:  'messages',
    sub:   'Promotional messages for new batches, events, and offers.',
  },
  {
    key:   'emails',
    label: 'Email messages',
    unit:  'emails',
    sub:   'Progress reports, announcements, and newsletter updates.',
  },
  {
    key:   'studyMaterialStorageMb',
    label: 'Study material storage',
    unit:  'MB',
    sub:   'PDFs, notes, and resources your teachers upload for students.',
  },
  {
    key:   'recordingStorageMb',
    label: 'Class recording storage',
    unit:  'MB',
    sub:   'Recorded live sessions students can replay anytime.',
  },
  {
    key:   'geminiDailyQueries',
    label: 'AI doubt solving (today)',
    unit:  'queries',
    sub:   'Students get instant AI answers. Resets every midnight.',
  },
];

// ─── Human-readable limit explanation ────────────────────────────────────────
// "You can send 1,250 SMS this month (250 students × 5/student)"

function limitSentence(
  metricKey:      UsageMetricKey,
  limit:          number,
  students:       number,
  ratePerStudent: number,
  isAnnual:       boolean,
): string {
  if (limit === 0) return 'Not included in your current plan.';

  const effectiveStudents = isAnnual ? Math.floor(students * 1.1) : students;

  const parts: Record<UsageMetricKey, string> = {
    sms:                    `You can send ${limit.toLocaleString()} SMS this month (${ratePerStudent}/student × ${effectiveStudents} students${isAnnual ? ' +10% annual bonus' : ''})`,
    whatsappUtility:        `You can send ${limit.toLocaleString()} WhatsApp messages this month (${ratePerStudent}/student × ${effectiveStudents} students)`,
    whatsappMarketing:      `You can send ${limit.toLocaleString()} promotional WhatsApp messages this month`,
    emails:                 `You can send ${limit.toLocaleString()} emails this month (${ratePerStudent}/student × ${effectiveStudents} students)`,
    studyMaterialStorageMb: `${(limit / 1_024).toFixed(1)} GB available for study materials this month`,
    recordingStorageMb:     `${(limit / 1_024).toFixed(0)} GB total recording space (base tier + ${effectiveStudents} students × 800 MB)`,
    geminiDailyQueries:     `${limit} AI doubt-solving queries per day (${effectiveStudents} students ÷ 2), resets at midnight`,
  };

  return parts[metricKey] ?? '';
}

// ─── Upgrade modal ────────────────────────────────────────────────────────────

function UpgradeModal({
  open, onClose, targetPlanId,
}: { open: boolean; onClose: () => void; targetPlanId: PlanId }) {
  const [method, setMethod] = useState<'razorpay' | 'cash'>('razorpay');
  const [cycle,  setCycle]  = useState<'monthly' | 'annual'>('monthly');
  const [notes,  setNotes]  = useState('');

  const plan  = getPlan(targetPlanId);
  const price = cycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

  const { upgrade: razorpayUpgrade, loading: rzpLoading } =
  useRazorpayUpgrade({
    planId: targetPlanId,
    cycle,
    onSuccess: onClose,
  });

const { upgrade: cashUpgrade, loading: cashPending } =
  useCashUpgrade({
    planId: targetPlanId,
    cycle,
    notes,
    onSuccess: onClose,
  });

  return (
    <Modal open={open} onClose={onClose} title={`Upgrade to ${plan.name}`} size="md">

      {/* Cycle toggle */}
      <div className="mb-5 flex gap-2">
        {(['monthly', 'annual'] as const).map(c => (
          <button key={c} onClick={() => setCycle(c)}
            className={cn(
              'flex flex-1 flex-col items-center rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-all',
              cycle === c
                ? 'border-violet-500/30 bg-violet-500/10 text-violet-300'
                : 'border-white/[0.07] text-white/38 hover:text-white/60',
            )}>
            {c === 'monthly' ? 'Monthly' : 'Annual'}
            {c === 'annual' && (
              <span className="mt-0.5 text-[10.5px] font-normal text-emerald-400">
                Save 2 months free
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Price */}
      <div className="mb-5 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 text-center">
        <p className="text-[30px] font-bold tracking-[-0.04em] text-white">
          ₹{price.toLocaleString('en-IN')}
          <span className="text-[15px] font-normal text-white/36">
            /{cycle === 'annual' ? 'year' : 'month'}
          </span>
        </p>
        {cycle === 'annual' && (
          <p className="mt-1 text-[12px] text-emerald-400">
            ₹{(plan.priceMonthly * 12 - plan.priceAnnual).toLocaleString('en-IN')} saved vs monthly
          </p>
        )}
      </div>

      {/* Payment method */}
      <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white/28">
        Payment method
      </p>
      <div className="mb-5 flex gap-2">
        {[
          { id: 'razorpay' as const, Icon: CreditCard, label: 'Online payment', note: 'Activates instantly' },
          { id: 'cash'     as const, Icon: Banknote,   label: 'Cash / bank',    note: '1–2 days to activate' },
        ].map(({ id, Icon, label, note }) => (
          <button key={id} onClick={() => setMethod(id)}
            className={cn(
              'flex flex-1 flex-col gap-1 rounded-xl border p-3 text-left transition-all',
              method === id
                ? 'border-violet-500/30 bg-violet-500/10'
                : 'border-white/[0.07] hover:border-white/[0.12]',
            )}>
            <div className="flex items-center gap-2">
              <Icon size={14} className={method === id ? 'text-violet-400' : 'text-white/40'} aria-hidden />
              <span className={cn('text-[13px] font-medium', method === id ? 'text-violet-300' : 'text-white/60')}>
                {label}
              </span>
            </div>
            <span className="text-[11px] text-white/28">{note}</span>
          </button>
        ))}
      </div>

      {/* Cash reference */}
      <AnimatePresence>
        {method === 'cash' && (
          <motion.div
            className="mb-5 flex flex-col gap-1.5"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2, ease: EASE_OUT }}
          >
            <label className="text-[12px] font-medium text-white/42">
              Transaction reference <span className="text-white/24">(optional)</span>
            </label>
            <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="UPI ID, cheque number, or transfer ref…"
              className="rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 py-3 text-[13.5px] text-white placeholder:text-white/20 outline-none focus:border-violet-500/45 transition-colors" />
            <p className="text-[11.5px] text-white/28">
              Your plan activates once our team confirms the payment — usually within 1–2 working days.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <Button fullWidth loading={rzpLoading || cashPending}
        onClick={() =>
  method === 'razorpay'
    ? razorpayUpgrade()
    : cashUpgrade()
}
        loadingText={method === 'razorpay' ? 'Opening secure payment…' : 'Submitting request…'}>
        <Zap size={14} />
        {method === 'razorpay' ? `Pay ₹${price.toLocaleString('en-IN')} now` : 'Submit upgrade request'}
      </Button>
    </Modal>
  );
}

// ─── Plan header card ─────────────────────────────────────────────────────────

function PlanHeaderCard({ onUpgrade }: { onUpgrade: () => void }) {
  const [now] = useState(() => Date.now());
  const { data: sub,       isLoading: subLoading }   = useSubscription();
  const { data: students,  isLoading: studentsLoad } = useActiveStudentCount();
  const { limits,          isLoading: limitsLoad }   = useResolvedLimits();

  const loading = subLoading || studentsLoad || limitsLoad;

  if (loading) {
    return (
      <Card className="p-6">
        <Skeleton className="mb-2 h-5 w-32" />
        <Skeleton className="mb-4 h-4 w-52" />
        <Skeleton className="mb-1 h-8 w-24" />
        <Skeleton className="mb-4 h-3 w-20" />
        <Skeleton className="h-9 w-36" />
      </Card>
    );
  }

  const plan    = getPlan(sub?.planId ?? 'basic');
  const upgrade = nextPlan(plan.id);

  const isActive  = sub?.status === 'active';
  const isExpired = sub?.status === 'expired';
  const statusVariant = isActive ? 'success' : isExpired ? 'danger' : 'warning';


  

const daysLeft = sub?.endDate
  ? Math.ceil((new Date(sub.endDate).getTime() - now) / 86_400_000)
  : null;

  if (!sub) return null; // ✅ AFTER hooks



  const expiringSoon = daysLeft != null && daysLeft <= 7;

  return (
    <Card className="p-6" deep>
      {/* Plan name + status */}
      <div className="mb-1 flex items-center gap-2.5">
        <h3 className="text-[17px] font-bold tracking-[-0.02em] text-white">{plan.name} Plan</h3>
        {sub?.status && <Badge variant={statusVariant} size="sm">{sub.status}</Badge>}
      </div>
      <p className="mb-5 text-[13px] text-white/42">{plan.description}</p>

      {/* Price */}
      <div className="mb-5">
        <p className="text-[26px] font-bold tracking-[-0.04em] text-white">
          ₹{plan.priceMonthly.toLocaleString('en-IN')}
          <span className="text-[13px] font-normal text-white/36"> / month</span>
        </p>
        {sub?.cycle === 'annual' && (
          <p className="mt-0.5 text-[12px] text-emerald-400">Annual billing — save 2 months</p>
        )}
      </div>

      {/* Active students line — the key insight */}
      {students != null && limits != null && (
        <div
          className="mb-5 flex items-start gap-3 rounded-xl p-3.5"
          style={{ background: `${theme.colors.violet[500]}0c`, border: `1px solid ${theme.colors.violet[500]}20` }}
        >
          <Users size={15} className="mt-0.5 shrink-0 text-violet-400" aria-hidden />
          <div>
            <p className="text-[13px] font-semibold text-white/82">
              {students} active student{students !== 1 ? 's' : ''}
            </p>
            <p className="mt-0.5 text-[12px] text-white/40">
              Your limits grow automatically as you enrol more students.
              {limits.isAnnual && ' Annual subscribers get a 10% bonus.'}
            </p>
          </div>
        </div>
      )}

      {/* Expiry */}
      {sub?.endDate && (
        <div className={cn(
          'mb-5 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[12.5px]',
          expiringSoon
            ? 'text-amber-400'
            : 'text-white/40',
        )}
          style={{
            background: expiringSoon ? `${theme.colors.amber[400]}10` : 'transparent',
            border:     expiringSoon ? `1px solid ${theme.colors.amber[400]}22` : 'none',
          }}>
          <Calendar size={13} className="shrink-0" aria-hidden />
          {expiringSoon
            ? `Your plan expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Renew to keep your limits.`
            : `Active until ${formatDate(sub.endDate)}`}
        </div>
      )}

      {/* Upgrade CTA */}
      {upgrade && (
        <Button onClick={onUpgrade} fullWidth>
          <TrendingUp size={14} />
          Upgrade to {upgrade.name} — increase all limits
        </Button>
      )}
    </Card>
  );
}

// ─── Usage section — with human-readable explanations ────────────────────────

function UsageSection({ onUpgrade }: { onUpgrade: () => void }) {
  const { summary, limits, isLoading } = useUsageSummary();
  const { data: sub }      = useSubscription();
  const { data: students } = useActiveStudentCount();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="mb-1 h-3 w-28" />
            <Skeleton className="mb-1 h-[5px] w-full rounded-full" />
            <Skeleton className="h-2.5 w-48" />
          </div>
        ))}
      </div>
    );
  }

  if (!summary || !limits) return null;

  const plan = getPlan(sub?.planId ?? 'basic');
  const exceeded = Object.values(summary).some(s => s.status === 'exceeded');

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={staggerContainer(0.06, 0.04)} initial="hidden" animate="visible"
    >
      {/* Alert banner */}
      {exceeded && (
        <motion.div variants={fadeUp}
          className="flex items-start gap-3 rounded-xl px-4 py-3.5 text-[13px]"
          style={{ background: `${theme.colors.rose[400]}0e`, border: `1px solid ${theme.colors.rose[400]}22` }}>
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-rose-400" aria-hidden />
          <div>
            <p className="font-semibold text-rose-400">
              You have reached one or more of your monthly limits.
            </p>
            <p className="mt-0.5 text-[12px] text-white/42">
              Upgrade your plan to continue sending messages and using these features.{' '}
              <button onClick={onUpgrade} className="text-violet-400 underline hover:no-underline">
                Upgrade now
              </button>
            </p>
          </div>
        </motion.div>
      )}

      {/* Meters */}
      {METER_CONFIG.map(({ key, label, unit, sub: meterSub }) => {
        const s = summary[key];

        const psl = plan.perStudentLimits;
const ratePerStudent = psl[key as keyof typeof psl] ?? 0;



const sentence = limitSentence(
  key,
  s.limit,
  students ?? 0,
  ratePerStudent,
  limits.isAnnual,
);

        return (
          <motion.div key={key} variants={fadeUp} className="flex flex-col gap-2">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-semibold text-white/80">{label}</span>
              <span className={cn(
                'shrink-0 text-[12px] font-bold tabular-nums',
                s.status === 'exceeded' ? 'text-rose-400'
                : s.status === 'warning'  ? 'text-amber-400'
                : 'text-white/40',
              )}>
                {s.limit === 0
                  ? 'Not on your plan'
                  : `${s.pct}% used`}
              </span>
            </div>

            {/* Bar */}
            <UsageMeter label="" state={s} unit={unit} />

            {/* Human sentence */}
            <p className="text-[11.5px] leading-[1.6] text-white/32">{sentence}</p>

            {/* Warning upgrade nudge */}
            {s.status !== 'ok' && s.limit > 0 && (
              <button onClick={onUpgrade}
                className="flex w-fit items-center gap-1 text-[11.5px] text-violet-400 transition-colors hover:text-violet-300">
                <ArrowRight size={11} />
                Upgrade to increase this limit
              </button>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ─── Plan comparison ──────────────────────────────────────────────────────────

function PlansComparison({
  currentPlanId,
  onSelect,
  students,
}: {
  currentPlanId: PlanId;
  onSelect:      (p: PlanId) => void;
  students:      number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {PLAN_ORDER.map(plan => {
        const psl      = plan.perStudentLimits;
        const isCurrent = plan.id === currentPlanId;
        const isAdvanced = plan.id === 'advanced';

        // Show concrete per-student value example
        const exampleSms   = psl.sms   * students;
        const exampleWa    = psl.whatsappUtility * students;
        const exampleEmail = psl.emails * students;

        return (
          <motion.div key={plan.id} variants={fadeUp}
            className={cn(
              'relative rounded-2xl border p-5',
              isCurrent
                ? 'border-violet-500/30 bg-violet-500/[0.06]'
                : isAdvanced
                ? 'border-white/[0.10] bg-white/[0.03]'
                : 'border-white/[0.07] bg-white/[0.026]',
            )}>
            {plan.badge && (
              <Badge variant={isAdvanced ? 'success' : 'info'} size="sm"
                className="absolute right-4 top-4">
                {plan.badge}
              </Badge>
            )}

            <h4 className="mb-0.5 text-[15px] font-bold text-white">{plan.name}</h4>
            <p className="mb-3 text-[12px] text-white/40">{plan.description}</p>

            {/* Price */}
            <p className="mb-4 text-[22px] font-bold tracking-[-0.03em] text-white">
              ₹{plan.priceMonthly.toLocaleString('en-IN')}
              <span className="text-[12px] font-normal text-white/36"> /mo</span>
            </p>

            {/* Per-student value example — only if we have a student count */}
            {students > 0 && (
              <div
                className="mb-4 rounded-xl p-3 text-[11.5px] text-white/50"
                style={{ background: 'rgba(255,255,255,0.025)' }}>
                <p className="mb-1 font-semibold text-white/60">
                  For your {students} students:
                </p>
                {psl.sms > 0
                  ? <p>• {exampleSms.toLocaleString()} SMS / month</p>
                  : <p className="text-white/28">• SMS — not included</p>}
                {psl.whatsappUtility > 0
                  ? <p>• {exampleWa.toLocaleString()} WhatsApp messages</p>
                  : <p className="text-white/28">• WhatsApp — not included</p>}
                {psl.emails > 0
                  ? <p>• {exampleEmail.toLocaleString()} emails</p>
                  : <p className="text-white/28">• Email — not included</p>}
              </div>
            )}

            {isCurrent ? (
              <Button variant="secondary" size="sm" fullWidth disabled>
                <CheckCircle2 size={13} /> Current plan
              </Button>
            ) : (
              <Button size="sm" fullWidth
                variant={isAdvanced ? 'primary' : 'secondary'}
                onClick={() => onSelect(plan.id as PlanId)}>
                <Zap size={13} />
                Switch to {plan.name}
              </Button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function BillingPage() {
  const [upgradeOpen,  setUpgradeOpen]  = useState(false);
  const [targetPlanId, setTargetPlanId] = useState<PlanId>('academic');

  const { data: sub }      = useSubscription();
  const { data: students } = useActiveStudentCount();
  const currentPlanId      = (sub?.planId ?? 'basic') as PlanId;

  const openUpgrade = (planId?: PlanId) => {
    const next = planId ?? nextPlan(currentPlanId)?.id;
    if (next) { setTargetPlanId(next as PlanId); setUpgradeOpen(true); }
  };

  return (
    <PageWrapper>
      {/* Header */}
      <motion.div className="mb-6" variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-[22px] font-bold tracking-[-0.03em] text-white">
          Billing & Plan
        </h1>
        <p className="mt-1 text-[13.5px] text-white/40">
          Your plan, usage, and limits — all in one place.
        </p>
      </motion.div>

      {/* Plan + usage — side by side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <PlanHeaderCard onUpgrade={() => openUpgrade()} />
        </div>
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[15px] font-bold tracking-[-0.02em] text-white">
                This month s usage
              </h3>
              <p className="text-[12px] text-white/28">Resets in {daysUntilReset()} days</p>
            </div>

            <UsageSection onUpgrade={() => openUpgrade()} />
          </Card>
        </div>
      </div>

      {/* Plan comparison */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-bold tracking-[-0.02em] text-white">
              Change your plan
            </h2>
            <p className="mt-0.5 text-[13px] text-white/40">
              Limits scale with your students automatically — upgrade when you need more.
            </p>
          </div>
        </div>
        <motion.div
          variants={staggerContainer(0.08, 0.04)} initial="hidden" animate="visible">
          <PlansComparison
            currentPlanId={currentPlanId}
            onSelect={openUpgrade}
            students={students ?? 0}
          />
        </motion.div>
      </div>

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        targetPlanId={targetPlanId}
      />
    </PageWrapper>
  );
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function daysUntilReset(): number {
  const now  = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return Math.ceil((next.getTime() - now.getTime()) / 86_400_000);
}
