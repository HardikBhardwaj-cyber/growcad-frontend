// modules/billing/limitEngine.ts
// ─────────────────────────────────────────────────────────────────────────────
// Pure computation: converts (plan + activeStudents + subscription cycle +
// usageRecord) → ResolvedLimits + UsageSummary.
//
// This is a PURE module — no React, no hooks, no API calls.
// Both the client (hooks) and server (API route) can import it safely.
// ─────────────────────────────────────────────────────────────────────────────

import { getPlan, getRecordingBaseTierGb } from './plans';
import type {
  PlanId, BillingCycle, UsageRecord,
  ResolvedLimits, UsageSummary, LimitState, LimitStatus,
} from './types';

// ─── Annual bonus multiplier ──────────────────────────────────────────────────
// Spec: if subscription.cycle === 'annual', effective_students = actual × 1.1

const ANNUAL_STUDENT_BONUS = 1.1;

// ─── LimitState factory ───────────────────────────────────────────────────────

function makeLimitState(
  used:   number,
  limit:  number,
  label?: string,
): LimitState {
  // 0-limit means the feature is blocked on this plan
  if (limit === 0) {
    return { used: 0, limit: 0, pct: 100, status: 'exceeded', label: 'Not included in plan' };
  }
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const status: LimitStatus = pct >= 100 ? 'exceeded' : pct >= 80 ? 'warning' : 'ok';
  return { used, limit, pct, status, label };
}

// ─── Core resolver ────────────────────────────────────────────────────────────

export interface LimitEngineInput {
  planId:        PlanId;
  cycle:         BillingCycle;
  activeStudents:number;
  usage:         Partial<UsageRecord>;
}

/**
 * computeResolvedLimits
 *
 * Applies per-student scaling + annual bonus to produce the effective monthly limits.
 * Call this whenever you need limits — never hard-code a limit value in a component.
 */
export function computeResolvedLimits(input: LimitEngineInput): ResolvedLimits {
  const { planId, cycle, activeStudents, usage } = input;
  const plan = getPlan(planId);
  const psl  = plan.perStudentLimits;
  const sl   = plan.staticLimits;

  // Apply annual bonus — annual subscribers effectively have more headroom
  const isAnnual         = cycle === 'annual';
  const effectiveStudents = isAnnual
    ? Math.floor(activeStudents * ANNUAL_STUDENT_BONUS)
    : activeStudents;

  const ctx = `Based on ${activeStudents} active student${activeStudents !== 1 ? 's' : ''}${isAnnual ? ' (+10% annual bonus)' : ''}`;

  // ── Messaging limits ───────────────────────────────────────────────────────
  const sms               = psl.sms               * effectiveStudents;
  const whatsappUtility   = psl.whatsappUtility   * effectiveStudents;
  const whatsappMarketing = psl.whatsappMarketing * effectiveStudents; // 0 if blocked
  const emails            = psl.emails            * effectiveStudents;

  // ── Study material storage (accumulates monthly from yearly allowance) ─────
  // studyMaterialMb in perStudentLimits is yearly budget per student.
  // Each month the budget grows by 1/12 of the annual allowance.
  // We surface the FULL yearly budget as the effective limit — the backend
  // enforces the monthly increment cap.
  const studyMaterialStorageMb = Math.floor((psl.studyMaterialMb / 12) * effectiveStudents);

  // ── Recording storage (Advanced only) ────────────────────────────────────
  // base_tier (from student count bracket) + per-student add-on
  let recordingStorageMb = 0;
  if (sl.recordingMbPerStudent > 0 && activeStudents > 0) {
    const baseMb = getRecordingBaseTierGb(activeStudents) * 1_024;
    const perStudentMb = sl.recordingMbPerStudent * activeStudents;
    recordingStorageMb = baseMb + perStudentMb;
  }

  // ── Gemini Flash daily quota (Advanced only) ──────────────────────────────
  // daily_queries = activeStudents / geminiDivisor (divisor=2 for Advanced)
  const geminiDailyQueries = sl.geminiDivisor > 0
    ? Math.max(1, Math.floor(activeStudents / sl.geminiDivisor))
    : 0;

  return {
    sms,
    whatsappUtility,
    whatsappMarketing,
    emails,
    studyMaterialStorageMb,
    recordingStorageMb,
    geminiDailyQueries,
    activeStudents,
    effectiveStudents,
    isAnnual,
  };
}

/**
 * computeUsageSummary
 *
 * Combines resolved limits + actual usage into per-metric LimitState objects
 * that the UI renders directly as progress bars.
 */
export function computeUsageSummary(
  limits:  ResolvedLimits,
  usage:   Partial<UsageRecord>,
): UsageSummary {
  const ctx = `${limits.activeStudents} student${limits.activeStudents !== 1 ? 's' : ''}`;

  return {
    sms: makeLimitState(
      usage.smsUsed ?? 0,
      limits.sms,
      `${limits.sms.toLocaleString()} / month (${ctx})`,
    ),
    whatsappUtility: makeLimitState(
      usage.whatsappUtilityUsed ?? 0,
      limits.whatsappUtility,
      `${limits.whatsappUtility.toLocaleString()} / month (${ctx})`,
    ),
    whatsappMarketing: makeLimitState(
      usage.whatsappMarketingUsed ?? 0,
      limits.whatsappMarketing,
      limits.whatsappMarketing === 0
        ? 'Not included in plan'
        : `${limits.whatsappMarketing.toLocaleString()} / month (${ctx})`,
    ),
    emails: makeLimitState(
      usage.emailUsed ?? 0,
      limits.emails,
      `${limits.emails.toLocaleString()} / month (${ctx})`,
    ),
    studyMaterialStorageMb: makeLimitState(
      usage.studyMaterialStorageMb ?? 0,
      limits.studyMaterialStorageMb,
      limits.studyMaterialStorageMb === 0
        ? 'Not included in plan'
        : `${(limits.studyMaterialStorageMb / 1_024).toFixed(1)} GB / month (${ctx})`,
    ),
    recordingStorageMb: makeLimitState(
      usage.recordingStorageMb ?? 0,
      limits.recordingStorageMb,
      limits.recordingStorageMb === 0
        ? 'Advanced plan only'
        : `${(limits.recordingStorageMb / 1_024).toFixed(1)} GB total (base + ${ctx} × 800MB)`,
    ),
    geminiDailyQueries: makeLimitState(
      usage.geminiQueriesUsedToday ?? 0,
      limits.geminiDailyQueries,
      limits.geminiDailyQueries === 0
        ? 'Advanced plan only'
        : `${limits.geminiDailyQueries} queries / day (${ctx} ÷ 2)`,
    ),
  };
}

/**
 * checkLimit
 *
 * Pre-flight check before a usage-consuming action.
 * Returns allowed:true/false + a human-readable reason for the UI.
 */
export function checkLimit(
  summary:  UsageSummary,
  metric:   keyof UsageSummary,
  quantity: number = 1,
): { allowed: boolean; reason?: string } {
  const s = summary[metric];

  if (s.limit === 0) {
    return {
      allowed: false,
      reason:  s.label ?? 'This feature is not available on your current plan. Please upgrade.',
    };
  }

  if (s.used + quantity > s.limit) {
    return {
      allowed: false,
      reason:  `Monthly ${metric} limit reached (${s.limit.toLocaleString()} / ${s.label ?? 'month'}). Upgrade to increase your limit.`,
    };
  }

  return { allowed: true };
}
