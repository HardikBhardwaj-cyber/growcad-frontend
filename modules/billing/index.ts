// modules/billing/index.ts
export * from './types';
export * from './plans';
export * from './limitEngine';
export { subscriptionApi, usageApi, paymentApi, upgradeApi, billingAdminApi, limitApi,
         studentCountApi, resolvedLimitsApi, guidedAiApi, geminiApi, storageApi } from './api';
export { useSubscription, useCurrentUsage, useActiveStudentCount,
         useResolvedLimits, useUsageSummary, useLimitCheck,
         useGeminiQuota, BILLING_KEYS } from './hooks/useBilling';
export { useRazorpayUpgrade, useCashUpgrade } from './hooks/useUpgrade';
export { useFeatureGate } from './hooks/useFeatureGate';
export { usePlanLevel } from './hooks/usePlanLevel';
export { useGeminiFlash, useGuidedAIContent, useUpsertGuidedContent, useAISearch } from './hooks/useAI';
export { UsageMeter }    from './components/UsageMeter';
export { UpgradeBanner } from './components/UpgradeBanner';
export { GatedFeature }  from './components/GatedFeature';
export { BillingPage }   from './components/BillingPage';
export { UsageWidget }   from './components/UsageWidget';
