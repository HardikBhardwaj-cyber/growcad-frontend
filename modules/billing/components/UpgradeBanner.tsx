// modules/billing/components/UpgradeBanner.tsx
'use client';
// ─────────────────────────────────────────────────────────────────────────────
// UpgradeBanner — shown when a feature is gated or a limit is exceeded.
//
// Two variants:
//   'inline' — compact horizontal strip inside an existing section.
//   'full'   — centered empty-state with icon, copy, and CTA (default for page gates).
//
// Props:
//   requiredPlan  — the plan that unlocks the feature.
//   currentPlan   — optional; displayed in copy for context.
//   featureName   — human-readable feature name shown in the message.
//   variant       — 'inline' | 'full' (default: 'inline').
// ─────────────────────────────────────────────────────────────────────────────

import { motion }                     from 'framer-motion';
import { Lock, Zap }                  from 'lucide-react';
import Link                           from 'next/link';
import { Button }                     from '@/components/ui/Button';
import { T_STANDARD, T_REVEAL, EASE_BACK } from '@/lib/motion';
import { theme }                      from '@/styles/theme';
import { getPlan }                    from '../plans';
import { analytics }                  from '@/lib/analytics';
import type { PlanId }                from '../types';
import { ROUTES }                     from '@/config/routes';

// ─── Props ────────────────────────────────────────────────────────────────────

interface UpgradeBannerProps {
  /** The minimum plan required to unlock this feature. */
  requiredPlan:  PlanId;
  /** The tenant's current plan — used in copy for context. */
  currentPlan?:  PlanId;
  /** Human-readable name of the locked feature. */
  featureName?:  string;
  /** Display variant. Default: 'inline'. */
  variant?:      'inline' | 'full';
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UpgradeBanner({
  requiredPlan,
  currentPlan,
  featureName = 'This feature',
  variant     = 'inline',
}: UpgradeBannerProps) {
  const plan = getPlan(requiredPlan);

  const handleCta = () => {
    analytics.cta('upgrade_banner', `Upgrade to ${plan.name}`, {
      feature:       featureName,
      required_plan: requiredPlan,
      current_plan:  currentPlan,
    });
  };

  // ── Full variant — centered empty state with icon ─────────────────────────
  if (variant === 'full') {
    return (
      <motion.div
        className="flex flex-col items-center justify-center gap-5 py-14 text-center"
        variants={{
          hidden:  { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        transition={T_REVEAL}
      >
        {/* Lock icon badge */}
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{
            background: `${theme.colors.violet[600]}18`,
            border:     `1px solid ${theme.colors.violet[500]}30`,
            boxShadow:  '0 0 40px rgba(124,58,237,0.15)',
          }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...T_STANDARD, ease: EASE_BACK, delay: 0.08 }}
          aria-hidden="true"
        >
          <Lock size={26} className="text-violet-400" />
        </motion.div>

        {/* Copy */}
        <motion.div
          className="flex flex-col items-center gap-1.5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...T_STANDARD, delay: 0.16 }}
        >
          <h3 className="text-[16px] font-semibold text-white">
            {featureName} requires {plan.name}
          </h3>
          <p className="max-w-[36ch] text-[13px] leading-relaxed text-white/40">
            {currentPlan
              ? `Your ${getPlan(currentPlan).name} plan doesn't include this feature.`
              : 'This feature is not included in your current plan.'}{' '}
            Upgrade to {plan.name} to unlock it and {plan.features.length - 1} more.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...T_STANDARD, delay: 0.24 }}
        >
          <Link href={ROUTES.billing as string} onClick={handleCta}>
            <Button size="md">
              <Zap size={14} />
              Upgrade to {plan.name}
            </Button>
          </Link>
        </motion.div>

        {/* Plan badge */}
        {plan.badge && (
          <motion.p
            className="text-[11.5px] text-violet-400/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...T_STANDARD, delay: 0.32 }}
          >
            {plan.badge}
          </motion.p>
        )}
      </motion.div>
    );
  }

  // ── Inline variant — compact horizontal strip ─────────────────────────────
  return (
    <motion.div
      className="flex items-center justify-between gap-4 rounded-xl px-4 py-3"
      style={{
        background: `${theme.colors.violet[600]}0c`,
        border:     `1px solid ${theme.colors.violet[500]}22`,
      }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={T_STANDARD}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Lock
          size={14}
          className="shrink-0 text-violet-400"
          aria-hidden="true"
        />
        <p className="truncate text-[12.5px] text-white/60">
          <span className="font-medium text-white/80">{featureName}</span>
          {' '}is available on the{' '}
          <span className="font-medium text-violet-400">{plan.name}</span> plan
        </p>
      </div>

      <Link href={ROUTES.billing as string} onClick={handleCta} className="shrink-0">
        <Button size="sm">
          <Zap size={12} />
          Upgrade
        </Button>
      </Link>
    </motion.div>
  );
}
