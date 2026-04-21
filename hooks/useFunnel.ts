// hooks/useFunnel.ts
'use client';
// ─────────────────────────────────────────────────────────────────────────────
// useFunnel — landing → signup → onboarding → dashboard funnel tracker.
//
// The `as any` on analytics.event() was caused by the eventMap being typed as
// Record<FunnelStage, string> instead of Record<FunnelStage, EventName>.
// The fix: import EventName and type the map correctly. No assertion needed.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useCallback } from 'react';
import { analytics, type EventName } from '@/lib/analytics';

// ─── Types ────────────────────────────────────────────────────────────────────


export type FunnelStage =
  | 'landing'
  | 'signup'
  | 'otp'
  | 'onboarding'
  | 'dashboard';

interface FunnelState {
  stages:    Partial<Record<FunnelStage, number>>;
  completed: FunnelStage[];
  startedAt: number;
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

const KEY = 'gc_funnel';

function readState(): FunnelState {
  if (typeof window === 'undefined') {
    return { stages: {}, completed: [], startedAt: Date.now() };
  }
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw
      ? (JSON.parse(raw) as FunnelState)
      : { stages: {}, completed: [], startedAt: Date.now() };
  } catch {
    return { stages: {}, completed: [], startedAt: Date.now() };
  }
}

function writeState(state: FunnelState): void {
  if (typeof window === 'undefined') return;
  try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch { /* non-fatal */ }
}

function clearState(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(KEY);
}

// ─── Stage → EventName map ────────────────────────────────────────────────────
// Typed as Record<FunnelStage, EventName> so TypeScript verifies every mapped
// value is a valid EventName. Previously typed as Record<FunnelStage, string>,
// which required `as any` to pass to analytics.event().

const STAGE_EVENT: Record<FunnelStage, EventName> = {
  landing:    'page_view',
  signup:     'signup_started',
  otp:        'otp_sent',
  onboarding: 'onboarding_step',
  dashboard:  'onboarding_completed',
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseFunnel {
  advance: (stage: FunnelStage, metadata?: Record<string, unknown>) => void;
  drop:    (stage: FunnelStage, reason?: string) => void;
  elapsed: () => number;
}

export function useFunnel(): UseFunnel {
  useEffect(() => {
    const state = readState();
    const hasStarted   = Object.keys(state.stages).length > 0;
    const hasDashboard = state.completed.includes('dashboard');

    if (hasStarted && !hasDashboard) {
      const stages = Object.keys(state.stages) as FunnelStage[];

if (stages.length === 0) return; // safety guard

const lastStage = stages.reduce<FunnelStage>((a, b) =>
  (state.stages[a] ?? 0) > (state.stages[b] ?? 0) ? a : b
, stages[0]);
      analytics.event('onboarding_resumed', {
        last_stage:        lastStage,
        funnel_elapsed_ms: Date.now() - state.startedAt,
      });
    }
  }, []);

  const advance = useCallback((
    stage:     FunnelStage,
    metadata?: Record<string, unknown>,
  ) => {
    const state = readState();
    const now   = Date.now();

    const prevTimestamps = Object.values(state.stages).filter(
      (v): v is number => typeof v === 'number',
    );
    const prevTime = prevTimestamps.length ? Math.max(...prevTimestamps) : state.startedAt;
    const elapsed  = now - prevTime;

    state.stages[stage] = now;
    state.completed      = [...new Set([...state.completed, stage])];
    writeState(state);

    // No assertion — STAGE_EVENT is Record<FunnelStage, EventName>
    analytics.event(STAGE_EVENT[stage], {
      stage,
      stage_elapsed_ms:  elapsed,
      funnel_elapsed_ms: now - state.startedAt,
      ...metadata,
    });

    if (stage === 'dashboard') clearState();
  }, []);

  const drop = useCallback((stage: FunnelStage, reason = 'unknown') => {
    const state = readState();
    analytics.event('onboarding_step', {
      stage,
      drop:              true,
      reason,
      funnel_elapsed_ms: Date.now() - state.startedAt,
    });
  }, []);

  const elapsed = useCallback((): number => {
    return Date.now() - readState().startedAt;
  }, []);

  return { advance, drop, elapsed };
}
