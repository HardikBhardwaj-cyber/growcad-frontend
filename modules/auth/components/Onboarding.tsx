// modules/auth/components/Onboarding.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Input }  from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { fadeUp, EASE_OUT } from '@/lib/motion';
import { post }   from '@/lib/api';
import { ROUTES } from '@/config/routes';
import { analytics } from '@/lib/analytics';
import { useFunnel } from '@/hooks/useFunnel';
import { useIncompleteOnboarding } from '@/hooks/useRetention';
import { AuthLogo } from './LoginForm';

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  {
    id:          'institute' as const,
    title:       'Name your institute',
    desc:        'Appears on student reports and fee receipts.',
    placeholder: 'e.g. Apex Academy',
    inputLabel:  'Institute name',
  },
  {
    id:          'students' as const,
    title:       'How many students?',
    desc:        "We'll set up the right plan for you.",
    placeholder: 'e.g. 150, 500, 2000',
    inputLabel:  'Approximate count',
  },
  {
    id:          'course' as const,
    title:       'Primary course type',
    desc:        "We'll pre-configure your dashboard.",
    placeholder: 'e.g. IIT JEE, NEET, CA',
    inputLabel:  'Course',
  },
] as const;

type StepId = typeof STEPS[number]['id'];

// ─── Auto-save keys ───────────────────────────────────────────────────────────

const SAVE_KEY  = 'gc_onboarding_progress';
const STEP_KEY  = 'gc_onboarding_step';

function saveProgress(values: string[], step: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(values));
    localStorage.setItem(STEP_KEY, String(step));
  } catch { /* quota — non-fatal */ }
}

function loadProgress(): { values: string[]; step: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw  = localStorage.getItem(SAVE_KEY);
    const step = localStorage.getItem(STEP_KEY);
    if (!raw) return null;
    return {
      values: JSON.parse(raw) as string[],
      step:   parseInt(step ?? '0', 10) || 0,
    };
  } catch { return null; }
}

function clearProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem(STEP_KEY);
}

// ─── Progress indicator ───────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-10">
      {/* Step counter */}
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/28">
        Step {step + 1} of {total}
      </p>
      {/* Bar track */}
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #3b82f6)' }}
          animate={{ width: `${((step + 1) / total) * 100}%` }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        />
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Onboarding() {
  const router = useRouter();
  const funnel = useFunnel();
  const { markComplete } = useIncompleteOnboarding();

  // Load saved progress on mount (resume support)
  const saved = typeof window !== 'undefined' ? loadProgress() : null;

  const [step,    setStep]    = useState(saved?.step    ?? 0);
  const [values,  setValues]  = useState<string[]>(saved?.values ?? Array(STEPS.length).fill(''));
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [resumed] = useState(Boolean(saved));

  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;

  // Track resume
  useEffect(() => {
    if (resumed) {
      analytics.event('onboarding_resumed', { step });
    }
  }, [resumed, step]);

  // Track step view
  useEffect(() => {
    analytics.event('onboarding_step', { step, step_id: current.id });
    funnel.advance('onboarding', { step, step_id: current.id });
  }, [step, current.id, funnel]);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values[step]) return;

    if (!isLast) {
      const next = step + 1;
      setStep(next);
      saveProgress(values, next);
      return;
    }

    // Final step — submit
    setLoading(true); setError('');
    try {
      await post('/onboarding', {
        institute: values[0],
        students:  values[1],
        course:    values[2],
      });

      // Mark complete in analytics + retention
      analytics.event('onboarding_completed', {
        institute: values[0],
        students:  values[1],
        course:    values[2],
      });
      funnel.advance('dashboard');
      markComplete();
      clearProgress();

      router.push(ROUTES.dashboard);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const updateValue = (val: string) => {
    const next = [...values];
    next[step] = val;
    setValues(next);
    saveProgress(next, step);
  };

  return (
    <motion.div
      className="w-full max-w-[400px]"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      <AuthLogo />
      <ProgressBar step={step} total={STEPS.length} />

      <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.026] p-8 backdrop-blur-[10px]">
        {/* Top-edge light */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)' }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20,  filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0,   filter: 'blur(0px)' }}
            exit={{   opacity: 0, x: -20,  filter: 'blur(4px)' }}
            transition={{ duration: 0.24, ease: EASE_OUT }}
          >
            <h1 className="mb-2 text-[22px] font-bold tracking-[-0.03em] text-white">
              {current.title}
            </h1>
            <p className="mb-7 text-[13.5px] text-white/42">{current.desc}</p>

            <form onSubmit={handleNext} className="flex flex-col gap-4">
              <Input
                autoFocus
                required
                label={current.inputLabel}
                value={values[step]}
                onChange={e => updateValue(e.target.value)}
                placeholder={current.placeholder}
              />

              {error && (
                <p className="text-[12.5px] text-rose-400">{error}</p>
              )}

              <Button type="submit" loading={loading} fullWidth className="mt-1">
                {isLast ? 'Go to dashboard' : 'Continue'}{' '}
                <ArrowRight size={14} />
              </Button>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Resume banner — shown only if progress was restored */}
      {resumed && step === 0 && (
        <motion.p
          className="mt-4 text-center text-[12px] text-white/32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.28, ease: EASE_OUT }}
        >
          ↩ Resumed where you left off
        </motion.p>
      )}
    </motion.div>
  );
}
