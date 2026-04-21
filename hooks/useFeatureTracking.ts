// hooks/useFeatureTracking.ts
'use client';
// ─────────────────────────────────────────────────────────────────────────────
// useFeatureTracking — tracks which features users interact with.
//
// Two modes:
//   1. Automatic idle detection: if a feature page is mounted for
//      IDLE_THRESHOLD_MS without an interaction, it fires feature_idle.
//      This surfaces features that users visit but don't engage with.
//
//   2. Manual track: call track() on meaningful interactions
//      (e.g., when a student is created, a fee recorded, AI query run).
//
// Usage:
//   // In a page component:
//   const { track } = useFeatureTracking('students');
//   // Call manually on meaningful action:
//   track({ action: 'create' });
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef } from 'react';
import { analytics } from '@/lib/analytics';

const IDLE_THRESHOLD_MS = 30_000; // 30s on page without interaction = idle

interface UseFeatureTracking {
  /** Call on meaningful user actions within the feature */
  track: (metadata?: Record<string, unknown>) => void;
}

export function useFeatureTracking(featureName: string): UseFeatureTracking {
  const mountedAt   = useRef<number>(0);
  const hasTracked  = useRef(false);
  const idleTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  // Track initial page view for this feature
  useEffect(() => {
    analytics.event('feature_used', { feature: featureName, action: 'viewed' });

    // Start idle timer — cleared if user interacts
    idleTimer.current = setTimeout(() => {
      if (!hasTracked.current) {
        analytics.feature(featureName, 'idle');
      }
    }, IDLE_THRESHOLD_MS);

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      // Track time-on-feature when unmounting
      const timeOnFeature = Date.now() - mountedAt.current;
      analytics.event('feature_used', {
        feature:     featureName,
        action:      'left',
        duration_ms: timeOnFeature,
      });
    };
  }, [featureName]);

  const track = useCallback((metadata?: Record<string, unknown>) => {
    // Clear idle timer — user has engaged
    if (idleTimer.current) clearTimeout(idleTimer.current);
    hasTracked.current = true;

    analytics.feature(featureName, 'used');
    if (metadata) {
      analytics.event('feature_used', { feature: featureName, ...metadata });
    }
  }, [featureName]);

  return { track };
}
