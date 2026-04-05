'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Check, Zap, ArrowRight } from 'lucide-react';
import MagneticButton from '../ui/MagneticButton';
import Reveal from '../motion/Reveal';
import {
  CONTAINER, SECTION_PY, SCENES,
  T, staggerDelay, DUR, EASE_OUT,
  HIERARCHY, SHADOW,
} from '../../systems/design';

type Cycle = 'monthly' | 'annual';

// ─── Plan data ─────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    prices: { monthly: 0, annual: 0 },
    desc: 'For solo founders validating ideas fast.',
    cta: 'Get started free',
    primary: false,
    badge: null as string | null,
    features: [
      '1 workspace',
      'Up to 10K monthly events',
      '3 dashboards',
      'Basic analytics',
      '7-day data retention',
      'Community support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    prices: { monthly: 79, annual: 59 },
    desc: 'For growing teams that need speed and AI automation.',
    cta: 'Start 14-day trial',
    primary: true,
    badge: 'Most popular',
    features: [
      'Unlimited workspaces',
      'Up to 10M monthly events',
      'Unlimited dashboards',
      'AI-powered insights',
      'A/B testing engine',
      '90-day data retention',
      'Slack + 60+ integrations',
      'Priority support (4h SLA)',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    prices: { monthly: null, annual: null },
    desc: 'For large orgs with custom compliance and scale.',
    cta: 'Talk to sales',
    primary: false,
    badge: null as string | null,
    features: [
      'Everything in Pro',
      'Unlimited events',
      'Custom retention & SLA',
      'SSO / SAML',
      'SOC 2 Type II + HIPAA',
      'Custom contracts & billing',
      'Dedicated Customer Success',
      'On-prem available',
    ],
  },
];

// ─── Plan card ────────────────────────────────────────────────────────────────
function PlanCard({ plan, cycle, i }: { plan: typeof PLANS[0]; cycle: Cycle; i: number }) {
  const price = cycle === 'annual' ? plan.prices.annual : plan.prices.monthly;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 44, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.06 }}
      transition={{
        duration: DUR.SLOW + i * 0.05,
        delay: staggerDelay(i, 0.1),
        ease: EASE_OUT,
      }}
    >
      {/* Pro card glow halo */}
      {plan.primary && (
        <>
          <div className="pointer-events-none absolute -inset-[3px] rounded-[21px] bg-gradient-to-br from-violet-500/30 via-blue-500/22 to-violet-500/12 blur-md" />
          <div className="pointer-events-none absolute -inset-[1px] rounded-[20px] bg-gradient-to-br from-violet-500/42 via-blue-500/30 to-violet-500/18 p-[1px]" />
        </>
      )}

      <motion.div
        className={[
          'relative flex h-full flex-col rounded-[18px] p-8',
          plan.primary ? 'bg-[#0d0d14]' : 'border border-white/[0.07] bg-white/[0.022]',
        ].join(' ')}
        style={{
          boxShadow: plan.primary ? SHADOW.dashCard : SHADOW.card,
        }}
        whileHover={
          !plan.primary
            ? { y: -5, boxShadow: SHADOW.cardLift }
            : undefined
        }
        transition={T.fast}
      >
        {/* Inner shine — primary only */}
        {plan.primary && (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />
            <div className="pointer-events-none absolute inset-0 rounded-[18px] bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />
          </>
        )}

        {/* Badge — primary indicator */}
        {plan.badge && (
          <div className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-violet-500/24 bg-violet-500/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-violet-300">
            <Zap size={9} />
            {plan.badge}
          </div>
        )}

        {/* Plan name — primary */}
        <h3 className={`mb-1.5 text-[16px] font-semibold ${HIERARCHY.primary}`}>
          {plan.name}
        </h3>
        {/* Desc — tertiary */}
        <p className={`mb-8 text-[13px] leading-relaxed ${HIERARCHY.tertiary}`}>
          {plan.desc}
        </p>

        {/* Price — largest number = highest primary weight */}
        <div className="mb-8" style={{ minHeight: 50 }}>
          <AnimatePresence mode="wait">
            {price === null ? (
              <motion.p
                key="custom"
                className={`text-[32px] font-bold tracking-tight ${HIERARCHY.primary}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={T.fast}
              >
                Custom
              </motion.p>
            ) : price === 0 ? (
              <motion.p
                key="free"
                className={`text-[32px] font-bold tracking-tight ${HIERARCHY.primary}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={T.fast}
              >
                Free
              </motion.p>
            ) : (
              <motion.div
                key={`p-${cycle}`}
                className="flex items-end gap-1.5"
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={T.fast}
              >
                <span className={`text-[32px] font-bold tracking-tight ${HIERARCHY.primary}`}>
                  ${price}
                </span>
                <span className={`mb-2 text-[13px] ${HIERARCHY.muted}`}>/mo</span>
                {cycle === 'annual' && (
                  <span className="mb-2 text-[11px] font-semibold text-emerald-400">
                    billed annually
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="mb-8">
          {plan.primary ? (
            <MagneticButton variant="primary" className="w-full justify-center">
              {plan.cta} <ArrowRight size={13} />
            </MagneticButton>
          ) : (
            <motion.button
              className={[
                'w-full rounded-full border border-white/[0.09] bg-white/[0.025] py-3.5',
                `text-[13px] font-medium ${HIERARCHY.tertiary}`,
                'transition-colors duration-200 hover:bg-white/[0.06] hover:border-white/[0.16] hover:text-white/80',
              ].join(' ')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={T.micro}
            >
              {plan.cta}
            </motion.button>
          )}
        </div>

        {/* Features — secondary weight, clean list */}
        <ul className="mt-auto space-y-3.5">
          {plan.features.map((f) => (
            <li key={f} className={`flex items-start gap-3 text-[13.5px] ${HIERARCHY.secondary}`}>
              <Check
                size={14}
                className={`mt-[1px] flex-shrink-0 ${plan.primary ? 'text-violet-400' : 'text-white/24'}`}
              />
              {f}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Pricing() {
  const [cycle, setCycle] = useState<Cycle>('annual');
  const sectionRef = useRef<HTMLElement>(null);

  // Pricing section gets a gentle scale entry — it's a decision moment,
  // the scale builds anticipation for the choice
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 85%', 'center 55%'],
  });
  const rawScale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);
  const scale    = useSpring(rawScale, { damping: 28, stiffness: 160 });

  return (
    <section
      ref={sectionRef}
      id="pricing"
      data-scene={SCENES.pricing}
      className={`relative overflow-hidden ${SECTION_PY.lg}`}
    >
      <div className="section-divider" />

      {/* Ambient — centered, builds the "decision" atmosphere */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2"
        style={{
          width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(109,40,217,0.06) 0%, transparent 65%)',
          filter: 'blur(130px)',
        }}
      />

      <motion.div style={{ scale }} className={CONTAINER.narrow}>
        {/* Header */}
        <Reveal className="mb-16 text-center">
          <p className="scene-label mb-4">Simple pricing</p>
          <h2
            className="mb-4 font-bold leading-[1.1] tracking-[-0.028em]"
            style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.2rem)' }}
          >
            <span className={HIERARCHY.primary}>Simple, honest pricing.</span>
            <br />
            <span className="text-white/26">No hidden seats.</span>
          </h2>
          <p className={`mb-8 text-[15px] ${HIERARCHY.tertiary}`}>
            Start free. Scale when you are ready.
          </p>

          {/* Toggle — layoutId for spring transition */}
          <div className="inline-flex items-center rounded-full border border-white/[0.09] bg-white/[0.03] p-1.5">
            {(['monthly', 'annual'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className={[
                  'relative flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-medium transition-colors duration-200',
                  cycle === c ? HIERARCHY.primary : `${HIERARCHY.tertiary} hover:text-white/55`,
                ].join(' ')}
              >
                {cycle === c && (
                  <motion.span
                    layoutId="pricing-toggle"
                    className="absolute inset-0 rounded-full bg-white/[0.09]"
                    transition={{ type: 'spring', damping: 24, stiffness: 280 }}
                  />
                )}
                <span className="relative z-10">
                  {c === 'monthly' ? 'Monthly' : 'Annual'}
                </span>
                {c === 'annual' && (
                  <span className="relative z-10 rounded-full border border-emerald-500/24 bg-emerald-500/12 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                    −25%
                  </span>
                )}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Plan grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} cycle={cycle} i={i} />
          ))}
        </div>

        {/* Footer note — muted (lowest hierarchy, just reassuring) */}
        <Reveal delay={0.28} className="mt-10 text-center">
          <p className={`text-[12.5px] ${HIERARCHY.muted}`}>
            14-day free trial on all plans · No credit card required · Cancel anytime
          </p>
        </Reveal>
      </motion.div>
    </section>
  );
}
