// modules/billing/plans.ts
// Per-student limit model. Static limits removed.
// All messaging quotas scale with active student count.

import { FEATURE, type Plan, type FeatureKey, type StorageTier } from './types';

// ─── Common features (all plans) ──────────────────────────────────────────────

const COMMON_FEATURES: FeatureKey[] = [
  FEATURE.STUDENT_MANAGEMENT,
  FEATURE.BATCH_MANAGEMENT,
  FEATURE.SMART_ATTENDANCE,
  FEATURE.SMS_ALERTS,
  FEATURE.WHATSAPP_NOTIFICATIONS,
  FEATURE.FEE_MANAGEMENT,
  FEATURE.AUTO_FEE_REMINDERS,
  FEATURE.ANNOUNCEMENTS,
  FEATURE.TEACHER_MANAGEMENT,
  FEATURE.TEST_OFFLINE,
  FEATURE.AI_WORKSPACE,       // Google Workspace AI — all plans, no hard limit
];

// ─── Plans ────────────────────────────────────────────────────────────────────

export const PLANS: Record<string, Plan> = {

  basic: {
    id:           'basic',
    name:         'Basic',
    description:  'Essential tools for small coaching institutes.',
    priceMonthly: 999,
    priceAnnual:  9_990,
    features: [...COMMON_FEATURES],
    perStudentLimits: {
      sms:               2,     // 2 SMS / student / month
      whatsappUtility:   1,     // 1 WA utility / student / month
      whatsappMarketing: 0,     // blocked
      emails:            1,     // 1 email / student / month
      studyMaterialMb:   200,   // 200MB / student / year  → ~16.7MB/month/student
    },
    staticLimits: {
      recordingMbPerStudent: 0,   // no recordings on Basic
      geminiDivisor:         0,   // no Gemini on Basic
    },
  },

  academic: {
    id:           'academic',
    name:         'Academic',
    description:  'Complete academic management with live classes.',
    priceMonthly: 2_499,
    priceAnnual:  24_990,
    badge:        'Most Popular',
    features: [
      ...COMMON_FEATURES,
      FEATURE.TEST_ONLINE,
      FEATURE.LIVE_CLASSES,
      FEATURE.STUDY_MATERIAL,
      FEATURE.STUDY_MATERIAL_STORAGE,
      FEATURE.CUSTOM_EMAIL,
      FEATURE.DASHBOARD_STANDARD,
      FEATURE.REPORTS_STANDARD,
      FEATURE.GUIDED_AI_CONTENT,
    ],
    perStudentLimits: {
      sms:               8,     // 8 SMS / student / month
      whatsappUtility:   6,     // 6 WA utility / student / month
      whatsappMarketing: 2,     // 2 WA marketing / student / month
      emails:            4,     // 4 emails / student / month
      studyMaterialMb:   500,   // 500MB / student / year → ~41.7MB/month/student
    },
    staticLimits: {
      recordingMbPerStudent: 0,   // no recording storage on Academic
      geminiDivisor:         0,   // no Gemini Flash on Academic
    },
  },

  advanced: {
    id:           'advanced',
    name:         'Advanced',
    description:  'Full-stack institute management with AI and analytics.',
    priceMonthly: 4_999,
    priceAnnual:  49_990,
    badge:        'Best Value',
    features: [
      ...COMMON_FEATURES,
      FEATURE.TEST_ONLINE,
      FEATURE.LIVE_CLASSES,
      FEATURE.STUDY_MATERIAL,
      FEATURE.STUDY_MATERIAL_STORAGE,
      FEATURE.RECORDED_LECTURES,
      FEATURE.STRUCTURED_VIDEO,
      FEATURE.RECORDING_STORAGE,
      FEATURE.AI_DOUBT_SOLVING,
      FEATURE.AI_GEMINI_FLASH,
      FEATURE.GUIDED_AI_CONTENT,
      FEATURE.WHATSAPP_MARKETING,
      FEATURE.CUSTOM_EMAIL,
      FEATURE.CUSTOM_DOMAIN,
      FEATURE.DASHBOARD_STANDARD,
      FEATURE.DASHBOARD_CUSTOM,
      FEATURE.REPORTS_STANDARD,
      FEATURE.REPORTS_ADVANCED,
    ],
    perStudentLimits: {
      sms:               40,    // 40 SMS / student / month
      whatsappUtility:   32,    // 32 WA utility / student / month
      whatsappMarketing: 12,    // 12 WA marketing / student / month
      emails:            20,    // 20 emails / student / month
      studyMaterialMb:   1_024, // 1GB / student / year → ~85.3MB/month/student
    },
    staticLimits: {
      recordingMbPerStudent: 800,  // 800MB recording cap per student
      geminiDivisor:         2,    // daily Gemini queries = activeStudents / 2
    },
  },
};

// ─── Recording base storage tiers (spec table) ────────────────────────────────
// Applied to Advanced plan only. Base allocation by student count bracket.
// Final recording storage = baseTierGb × 1024 + (students × 800MB)

export const RECORDING_STORAGE_TIERS: StorageTier[] = [
  { minStudents:   1, maxStudents:  149, baseGb: 120 },
  { minStudents: 150, maxStudents:  249, baseGb: 200 },
  { minStudents: 250, maxStudents:  499, baseGb: 400 },
  { minStudents: 500, maxStudents:  749, baseGb: 600 },
  { minStudents: 750, maxStudents: Infinity, baseGb: 800 },
];

// ─── Ordered for display ──────────────────────────────────────────────────────

export const PLAN_ORDER: Plan[] = [PLANS.basic, PLANS.academic, PLANS.advanced];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getPlan(planId: string): Plan {
  return PLANS[planId] ?? PLANS.basic;
}

export function isPlanHigher(a: string, b: string): boolean {
  const o = ['basic', 'academic', 'advanced'];
  return o.indexOf(a) > o.indexOf(b);
}

export function nextPlan(planId: string): Plan | null {
  const idx = PLAN_ORDER.findIndex(p => p.id === planId);
  return idx >= 0 && idx < PLAN_ORDER.length - 1 ? PLAN_ORDER[idx + 1] : null;
}

export function planHasFeature(planId: string, feature: FeatureKey): boolean {
  return getPlan(planId).features.includes(feature);
}

/** Look up recording base storage (GB) for a given student count. */
export function getRecordingBaseTierGb(students: number): number {
  const tier = RECORDING_STORAGE_TIERS.find(
    t => students >= t.minStudents && students <= t.maxStudents,
  );
  return tier?.baseGb ?? 120;
}
