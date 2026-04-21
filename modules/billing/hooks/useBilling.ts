// modules/billing/hooks/useBilling.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { subscriptionApi, usageApi, studentCountApi } from '../api';
import {
  computeResolvedLimits,
  computeUsageSummary,
  checkLimit,
} from '../limitEngine';
import type {
  UsageSummary,
  ResolvedLimits,
  UsageMetricKey,
  PlanId,
} from '../types';

// ─── Cache keys ───────────────────────────────────────────────────────────────

export const BILLING_KEYS = {
  subscription: ['billing', 'subscription'] as const,
  usage: ['billing', 'usage', 'current'] as const,
  history: ['billing', 'usage', 'history'] as const,
  payments: ['billing', 'payments'] as const,
  activeStudents: ['students', 'count', 'active'] as const,
};

// ─── useSubscription ──────────────────────────────────────────────────────────

export function useSubscription() {
  return useQuery({
    queryKey: BILLING_KEYS.subscription,
    queryFn: subscriptionApi.current,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

// ─── useCurrentUsage ──────────────────────────────────────────────────────────

export function useCurrentUsage() {
  return useQuery({
    queryKey: BILLING_KEYS.usage,
    queryFn: usageApi.current,
    staleTime: 60_000,
    retry: 1,
  });
}

// ─── useActiveStudentCount ────────────────────────────────────────────────────

export function useActiveStudentCount() {
  return useQuery({
    queryKey: BILLING_KEYS.activeStudents,
    queryFn: () => studentCountApi.active().then((r) => r.count),
    staleTime: 2 * 60_000,
    retry: 1,
  });
}

// ─── SAFE PLAN NORMALIZER ─────────────────────────────────────────────────────

function normalizePlan(plan?: string): PlanId {
  if (plan === 'academic' || plan === 'advanced' || plan === 'enterprise') {
    return plan;
  }
  return 'basic';
}

// ─── useResolvedLimits ────────────────────────────────────────────────────────

export function useResolvedLimits(): {
  limits: ResolvedLimits | null;
  isLoading: boolean;
} {
  const { data: sub, isLoading: subLoading } = useSubscription();
  const { data: count, isLoading: countLoading } = useActiveStudentCount();

  if (subLoading || countLoading) {
    return { limits: null, isLoading: true };
  }

  const limits = computeResolvedLimits({
    planId: normalizePlan(sub?.planId),
    cycle: sub?.cycle ?? 'monthly',
    activeStudents: count ?? 0,
    usage: {},
  });

  return { limits, isLoading: false };
}

// ─── useUsageSummary ──────────────────────────────────────────────────────────

export function useUsageSummary(): {
  summary: UsageSummary | null;
  limits: ResolvedLimits | null;
  isLoading: boolean;
} {
  const { data: sub, isLoading: subLoading } = useSubscription();
  const { data: usage, isLoading: usageLoading } = useCurrentUsage();
  const { data: count, isLoading: countLoading } = useActiveStudentCount();

  if (subLoading || usageLoading || countLoading) {
    return { summary: null, limits: null, isLoading: true };
  }

  const limits = computeResolvedLimits({
    planId: normalizePlan(sub?.planId),
    cycle: sub?.cycle ?? 'monthly',
    activeStudents: count ?? 0,
    usage: usage ?? {},
  });

  const summary = computeUsageSummary(limits, usage ?? {});

  return { summary, limits, isLoading: false };
}

// ─── useLimitCheck ────────────────────────────────────────────────────────────

export function useLimitCheck() {
  const { summary } = useUsageSummary();

  return {
    check: (
      metric: UsageMetricKey,
      quantity = 1
    ): {
      allowed: boolean;
      pct: number;
      status: 'ok' | 'warning' | 'exceeded';
      reason?: string;
    } => {
      if (!summary) {
        return { allowed: true, pct: 0, status: 'ok' };
      }

      const s = summary[metric];
      const result = checkLimit(summary, metric, quantity);

      return {
        ...result,
        pct: s?.pct ?? 0,
        status: s?.status ?? 'ok',
      };
    },
  };
}

// ─── useGeminiQuota ───────────────────────────────────────────────────────────

export function useGeminiQuota() {
  const { summary, isLoading } = useUsageSummary();

  const quota = summary?.geminiDailyQueries;

  return {
    isLoading,
    quota: quota
      ? {
          ...quota,
          resetAt: quota.resetAt ?? new Date().toISOString(),
        }
      : null,
  };
}