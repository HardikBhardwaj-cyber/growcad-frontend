// modules/billing/hooks/useFeatureGate.ts
'use client';
// ─────────────────────────────────────────────────────────────────────────────
// useFeatureGate — backend-verified plan feature access.
//
// Queries /api/billing/feature-gate?feature=<key> and returns whether the
// authenticated tenant's current plan includes that feature.
//
// Why a backend call instead of client-side plan lookup:
//   The client-side lookup (planHasFeature) trusts what is in the Zustand
//   store. If a subscription expires, the store is stale until the user
//   refreshes. The backend route resolves the live subscription from the DB
//   on every query, so a feature can be withdrawn without a page reload.
//   The 30-second staleTime balances freshness against request volume.
//
// Usage:
//   const { allowed, loading, error } = useFeatureGate(FEATURE.AI_GEMINI_FLASH);
//   if (loading) return <Skeleton />;
//   if (!allowed) return <UpgradeBanner />;
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery }    from '@tanstack/react-query';
import { get }         from '@/lib/api';
import { FEATURE }     from '@/modules/billing/types';
import type { FeatureKey } from '@/modules/billing/types';
import type { PlanId }     from '@/modules/billing/types';

// ─── API response shape ───────────────────────────────────────────────────────

interface FeatureGateResponse {
  feature: FeatureKey;
  allowed: boolean;
  planId:  PlanId;
}

// ─── Hook return type ─────────────────────────────────────────────────────────

export interface UseFeatureGateResult {
  /** Whether the tenant's current plan includes this feature. */
  allowed:  boolean;
  /** True while the initial request is in-flight. */
  loading:  boolean;
  /** Human-readable error message if the request failed. */
  error?:   string;
  /** The plan ID that was checked. Undefined until the query resolves. */
  planId?:  PlanId;
}

// ─── Cache key factory ────────────────────────────────────────────────────────

function featureGateKey(feature: FeatureKey): readonly ['billing', 'feature-gate', FeatureKey] {
  return ['billing', 'feature-gate', feature] as const;
}

// ─── Query function ───────────────────────────────────────────────────────────

function fetchFeatureGate(feature: FeatureKey): Promise<FeatureGateResponse> {
  return get<FeatureGateResponse>('/billing/feature-gate', { feature });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Checks whether the authenticated tenant's active plan includes `feature`.
 * Makes a single GET to `/api/billing/feature-gate` and caches the result
 * for 30 seconds. Safe to call in any component — returns `allowed: false`
 * while loading so gated UI is never shown prematurely.
 *
 * @param feature  A `FEATURE` constant value, e.g. `FEATURE.AI_GEMINI_FLASH`.
 *
 * @example
 *   const { allowed, loading } = useFeatureGate(FEATURE.AI_GEMINI_FLASH);
 *   if (!loading && !allowed) return <UpgradeBanner feature={feature} />;
 */
export function useFeatureGate(feature: FeatureKey): UseFeatureGateResult {
  const { data, isLoading, isError, error } = useQuery({
    queryKey:  featureGateKey(feature),
    queryFn:   () => fetchFeatureGate(feature),
    staleTime: 30_000,   // 30 seconds — balances freshness vs request volume
    retry:     1,        // one retry on transient network error
    // Conservative default: deny access while loading or on error.
    // This prevents a flash of gated UI appearing before the response arrives.
    placeholderData: undefined,
  });

  if (isLoading) {
    return { allowed: false, loading: true };
  }

  if (isError) {
    const message =
      error instanceof Error
        ? error.message
        : 'Could not verify feature access. Please try again.';
    return { allowed: false, loading: false, error: message };
  }

  return {
    allowed: data?.allowed ?? false,
    loading: false,
    planId:  data?.planId,
  };
}

// Re-export FEATURE so callers can import from a single path:
//   import { useFeatureGate, FEATURE } from '@/modules/billing/hooks/useFeatureGate';
export { FEATURE };
export type { FeatureKey };
