// server/modules/usage/service.ts
// ─────────────────────────────────────────────────────────────────────────────
// Usage tracking service — the ONLY place that writes to UsageRecord.
//
// Responsibilities:
//   • consumeUsage()   — atomic increment + limit pre-check (used by all channels)
//   • getUsage()       — current month record, zeroed if missing
//   • getResolved()    — full limit resolution (plan × students × cycle)
//   • resetMonthlyUsage() — called by cron on 1st of each month
//   • resetDailyGemini()  — Gemini counter reset (checked inline, not by cron)
//
// Every action that consumes a tracked resource calls consumeUsage() FIRST.
// It returns { allowed: false } when limit is reached → the caller blocks the action.
// The check + increment is atomic via a conditional Prisma updateMany.
// ─────────────────────────────────────────────────────────────────────────────

import db from '@/server/lib/db';
import { computeResolvedLimits } from '@/modules/billing/limitEngine';
import { getPlan } from '@/modules/billing/plans';
import { currentMonth } from '@/server/modules/billing/service';
import type { PlanId, BillingCycle, UsageMetricKey } from '@/modules/billing/types';

// ─── Field map: metric key → Prisma field names ───────────────────────────────
// Keeps the increment code generic — one function handles all metrics.
type UsageRecordShape = {
  smsUsed: number;
  whatsappUtilityUsed: number;
  whatsappMarketingUsed: number;
  emailUsed: number;
  studyMaterialStorageMb: number;
  recordingStorageMb: number;
  geminiQueriesUsedToday: number;
};

type UsageField = {
  field:    keyof UsageRecordShape;             // Prisma field to increment
  isDaily?: boolean;            // true for Gemini (resets daily, not monthly)
  dateField?:string;            // companion date field for daily metrics
};

const METRIC_FIELD_MAP: Record<UsageMetricKey, UsageField> = {
  sms:                   { field: 'smsUsed'                },
  whatsappUtility:       { field: 'whatsappUtilityUsed'    },
  whatsappMarketing:     { field: 'whatsappMarketingUsed'  },
  emails:                { field: 'emailUsed'              },
  studyMaterialStorageMb:{ field: 'studyMaterialStorageMb' },
  recordingStorageMb:    { field: 'recordingStorageMb'     },
  geminiDailyQueries:    {
    field:     'geminiQueriesUsedToday',
    isDaily:   true,
    dateField: 'geminiQueriesDate',
  },
};

// ─── Tenant context for limit resolution ─────────────────────────────────────

interface TenantContext {
  tenantId:  string;
  planId:    PlanId;
  cycle:     BillingCycle;
}

// ─── getUsage ─────────────────────────────────────────────────────────────────

export async function getUsage(tenantId: string, month?: string) {
  const m = month ?? currentMonth();
  const record = await db.usageRecord.findUnique({
    where: { tenantId_month: { tenantId, month: m } },
  });

  if (!record) {
    // Return zeroed record — no DB write needed just for a read
    return {
      id: 'none', tenantId, month: m,
      smsUsed: 0, whatsappUtilityUsed: 0, whatsappMarketingUsed: 0,
      emailUsed: 0, studyMaterialStorageMb: 0, recordingStorageMb: 0,
      geminiQueriesUsedToday: 0, geminiQueriesDate: null,
      updatedAt: new Date(),
    };
  }

  return record;
}

// ─── getResolved ──────────────────────────────────────────────────────────────
// Computes the current limits for a tenant using the limit engine.

export async function getResolved(tenantId: string) {
  const [sub, studentCount] = await Promise.all([
    db.subscription.findFirst({
      where:   { tenantId, status: 'active' },
      orderBy: { createdAt: 'desc' },
      select:  { planId: true, cycle: true },
    }),
    db.student.count({ where: { tenantId, status: 'active', deletedAt: null } }),
  ]);

  const planId = (sub?.planId ?? 'basic') as PlanId;
  const cycle  = (sub?.cycle  ?? 'monthly') as BillingCycle;

  return computeResolvedLimits({
    planId,
    cycle,
    activeStudents: studentCount,
    usage: {},
  });
}

// ─── consumeUsage ─────────────────────────────────────────────────────────────
// The central gate: check limit → if allowed, increment atomically.
//
// Returns { allowed, used, limit, reason }
// Callers MUST check .allowed before proceeding with the action.

export interface ConsumeResult {
  allowed:  boolean;
  used:     number;
  limit:    number;
  reason?:  string;
}

export async function consumeUsage(
  ctx:      TenantContext,
  metric:   UsageMetricKey,
  quantity: number = 1,
): Promise<ConsumeResult> {
  const { tenantId, planId, cycle } = ctx;
  const month  = currentMonth();
  const today  = todayStr();
  const config = METRIC_FIELD_MAP[metric];

  // ── Step 1: resolve limits for this tenant ──────────────────────────────────
  const studentCount = await db.student.count({
    where: { tenantId, status: 'active', deletedAt: null },
  });

  const limits = computeResolvedLimits({
    planId, cycle, activeStudents: studentCount, usage: {},
  });

  const limit = limits[metric as keyof typeof limits] as number;

  // 0-limit = feature not on plan
  if (limit === 0) {
    return {
      allowed: false,
      used:    0,
      limit:   0,
      reason:  `This feature is not available on your ${planId} plan. Please upgrade.`,
    };
  }

  // ── Step 2: get or create usage record ──────────────────────────────────────
  let record = await db.usageRecord.upsert({
    where:  { tenantId_month: { tenantId, month } },
    update: {},
    create: { tenantId, month },
  });

  // ── Step 3: handle daily Gemini reset ───────────────────────────────────────
  if (config.isDaily && record.geminiQueriesDate !== today) {
    record = await db.usageRecord.update({
      where: { tenantId_month: { tenantId, month } },
      data:  { geminiQueriesUsedToday: 0, geminiQueriesDate: today },
    });
  }

  // ── Step 4: check current usage ─────────────────────────────────────────────
  const currentUsed = record[config.field as keyof typeof record] as number;

  if (currentUsed + quantity > limit) {
    return {
      allowed: false,
      used:    currentUsed,
      limit,
      reason:  buildLimitMessage(metric, currentUsed, limit, studentCount, planId),
    };
  }

  // ── Step 5: atomic increment ─────────────────────────────────────────────────
  // Use Prisma increment — safe under concurrent requests
  const updated = await db.usageRecord.update({
    where: { tenantId_month: { tenantId, month } },
    data:  { [config.field]: { increment: quantity } },
  });

  const newUsed = updated[config.field as keyof typeof updated] as number;

  return {
    allowed: true,
    used:    newUsed,
    limit,
  };
}

// ─── resetMonthlyUsage ────────────────────────────────────────────────────────
// Called on the 1st of each month by the cron route.
// Creates fresh records for all tenants — does NOT delete old records (history).

export async function resetMonthlyUsage(): Promise<number> {
  const month = currentMonth();

  // Get all active tenants
  const tenants = await db.tenant.findMany({
    select: { id: true },
    where:  {
      subscriptions: {
        some: { status: 'active' },
      },
    },
  });

  if (tenants.length === 0) return 0;

  // Upsert fresh record for each — existing records from previous months untouched
  await db.usageRecord.createMany({
    data:            tenants.map(t => ({ tenantId: t.id, month })),
    skipDuplicates:  true,
  });

  return tenants.length;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

function buildLimitMessage(
  metric:   UsageMetricKey,
  used:     number,
  limit:    number,
  students: number,
  planId:   PlanId,
): string {
  const LABELS: Record<UsageMetricKey, string> = {
    sms:                   'SMS messages',
    whatsappUtility:       'WhatsApp messages',
    whatsappMarketing:     'WhatsApp marketing messages',
    emails:                'emails',
    studyMaterialStorageMb:'study material storage',
    recordingStorageMb:    'recording storage',
    geminiDailyQueries:    'AI queries for today',
  };

  const label = LABELS[metric] ?? metric;

  if (metric === 'geminiDailyQueries') {
    return `Daily AI limit reached (${limit} queries for ${students} students). Resets at midnight.`;
  }

  return `Monthly ${label} limit reached (${used.toLocaleString()} of ${limit.toLocaleString()} used). Upgrade to ${nextPlanName(planId)} for more.`;
}

function nextPlanName(planId: PlanId): string {
  if (planId === 'basic')    return 'Academic';
  if (planId === 'academic') return 'Advanced';
  return 'a higher plan';
}
