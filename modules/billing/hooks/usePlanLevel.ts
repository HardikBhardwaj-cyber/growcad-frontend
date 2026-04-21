// modules/billing/hooks/usePlanLevel.ts

import { useSubscription } from './useBilling';
import type { PlanId } from '../types';

export function usePlanLevel() {
  const { data, isLoading } = useSubscription();

  const plan = (data?.planId ?? null) as PlanId | null;

  return {
    plan,
    isLoading,

    isBasic: plan === 'basic',
    isAcademic: plan === 'academic',
    isAdvanced: plan === 'advanced',
    isEnterprise: plan === 'enterprise',
  };
}