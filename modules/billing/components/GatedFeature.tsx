// modules/billing/components/GatedFeature.tsx
'use client';
// ─────────────────────────────────────────────────────────────────────────────
// GatedFeature — declarative JSX wrapper for plan-gated content.
//
// Usage:
//   <GatedFeature feature={FEATURE.LIVE_CLASSES} featureName="Live Classes">
//     <LiveClassesModule />
//   </GatedFeature>
//
// When the feature is allowed → children rendered.
// When blocked              → fallback (if provided) or UpgradeBanner.
// While loading             → loadingFallback (if provided) or null.
// Superadmin bypass         → bypass prop skips the gate entirely.
//
// Scalable for future gating patterns:
//   • AI limits: <GatedFeature feature={FEATURE.AI_GEMINI_FLASH} ... />
//   • Storage:   <GatedFeature feature={FEATURE.RECORDING_STORAGE} ... />
//   • Marketing: <GatedFeature feature={FEATURE.WHATSAPP_MARKETING} ... />
// ─────────────────────────────────────────────────────────────────────────────

import { type ReactNode } from 'react';
import { useFeatureGate } from '../hooks/useFeatureGate';
import { UpgradeBanner }  from './UpgradeBanner';
import type { FeatureKey, PlanId } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface GatedFeatureProps {
  /** The feature key to gate on — use a FEATURE.* constant. */
  feature:          FeatureKey;
  /** Human-readable name displayed in the upgrade UI. */
  featureName:      string;
  /** Content rendered when the feature is allowed. */
  children:         ReactNode;
  /**
   * Rendered when the feature is blocked.
   * Default: UpgradeBanner (inline variant).
   * Pass `null` to render nothing when blocked.
   */
  fallback?:        ReactNode;
  /**
   * Rendered while the feature check is in flight.
   * Default: null (renders nothing, avoids layout shift).
   */
  loadingFallback?: ReactNode;
  /**
   * Banner display variant when no custom fallback is provided.
   * Default: 'inline'.
   */
  bannerVariant?:   'inline' | 'full';
  /**
   * Skip the gate and always render children.
   * Use for superadmin views or test environments.
   */
  bypass?:          boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GatedFeature({
  feature,
  featureName,
  children,
  fallback,
  loadingFallback  = null,
  bannerVariant    = 'inline',
  bypass           = false,
}: GatedFeatureProps) {
  const { allowed, loading, requiredPlan } = useFeatureGate(feature);

  // Bypass: superadmin or test mode — skip gate entirely
  if (bypass) return <>{children}</>;

  // Loading: the feature check is in-flight
  if (loading) return <>{loadingFallback}</>;

  // Allowed: render the protected content
  if (allowed) return <>{children}</>;

  // Blocked: render the fallback if provided, otherwise the upgrade banner
  if (fallback !== undefined) return <>{fallback}</>;

  // Default blocked UI — resolve the required plan for the banner
  // requiredPlan comes from the plan registry (no extra network request)
  const targetPlan: PlanId = requiredPlan ?? 'academic';

  return (
    <UpgradeBanner
      featureName={featureName}
      requiredPlan={targetPlan}
      variant={bannerVariant}
    />
  );
}
