// hooks/useRetention.ts
'use client';
// ─────────────────────────────────────────────────────────────────────────────
// useRetention — retention signal hooks.
//
// Provides two independent mechanisms:
//
// 1. Incomplete onboarding reminder:
//    Checks if user has completed onboarding. If not, and they've been
//    authenticated for > ONBOARDING_REMINDER_DELAY_MS, fires an event
//    and shows a toast nudge.
//
// 2. No-activity detection:
//    Tracks last meaningful action via localStorage. If user returns after
//    INACTIVITY_THRESHOLD_MS of no logged actions, fires a re-engagement event.
//    The app can use this to surface a "Welcome back" prompt or highlight
//    features they haven't used.
//
// This module only fires events and optionally shows toasts.
// No UI is rendered — retention logic is invisible infrastructure.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useCallback, useRef } from 'react';
import { analytics } from '@/lib/analytics';
import { useAuthStore } from '@/store/auth.store';

// ─── Thresholds ───────────────────────────────────────────────────────────────

// If user has been authenticated but hasn't reached dashboard in this time,
// flag as incomplete onboarding.
const ONBOARDING_REMINDER_DELAY_MS = 10 * 60 * 1000; // 10 min

// If last_active is older than this, user is considered re-engaging.
const INACTIVITY_THRESHOLD_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

// ─── Storage keys ─────────────────────────────────────────────────────────────

const LAST_ACTIVE_KEY       = 'gc_last_active';
const ONBOARDING_DONE_KEY   = 'gc_onboarding_done';
const SESSION_STARTED_KEY   = 'gc_session_started';

// ─── Utilities ────────────────────────────────────────────────────────────────

function getLastActive(): number {
  if (typeof window === 'undefined') return Date.now();
  return parseInt(localStorage.getItem(LAST_ACTIVE_KEY) ?? '0', 10) || 0;
}

function touchLastActive(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
}

function markOnboardingDone(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ONBOARDING_DONE_KEY, 'true');
}

function isOnboardingDone(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(ONBOARDING_DONE_KEY) === 'true';
}

// ─── Incomplete onboarding hook ───────────────────────────────────────────────

interface UseIncompleteOnboarding {
  /** Call when user successfully completes onboarding */
  markComplete: () => void;
}

export function useIncompleteOnboarding(): UseIncompleteOnboarding {
  const user = useAuthStore(s => s.user);
  const fired = useRef(false);

  useEffect(() => {
    if (!user || isOnboardingDone() || fired.current) return;

    const sessionStarted = parseInt(
      sessionStorage.getItem(SESSION_STARTED_KEY) ?? '0', 10
    ) || Date.now();

    sessionStorage.setItem(SESSION_STARTED_KEY, String(sessionStarted));

    const delay = ONBOARDING_REMINDER_DELAY_MS;
    const remaining = delay - (Date.now() - sessionStarted);

    if (remaining <= 0) {
      // Already past the threshold in this session
      if (!fired.current) {
        fired.current = true;
        analytics.event('onboarding_step', {
          stage:    'incomplete_reminder',
          userId:   user.id,
          reminder: true,
        });
      }
      return;
    }

    // Schedule a delayed check
    const timer = setTimeout(() => {
      if (!isOnboardingDone() && !fired.current) {
        fired.current = true;
        analytics.event('onboarding_step', {
          stage:    'incomplete_reminder',
          userId:   user.id,
          reminder: true,
          delay_ms: delay,
        });
      }
    }, remaining);

    return () => clearTimeout(timer);
  }, [user]);

  const markComplete = useCallback(() => {
    markOnboardingDone();
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_STARTED_KEY);
    }
  }, []);

  return { markComplete };
}

// ─── No-activity detection hook ───────────────────────────────────────────────

interface UseActivityTracking {
  /** Call on any meaningful user action to reset the inactivity timer */
  recordActivity: () => void;
}

export function useActivityTracking(): UseActivityTracking {
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    if (!user) return;

    const lastActive = getLastActive();
    const gap        = Date.now() - lastActive;

    if (lastActive > 0 && gap > INACTIVITY_THRESHOLD_MS) {
      // User is re-engaging after an extended absence
      analytics.event('session_start', {
        re_engagement:  true,
        inactive_for_ms: gap,
        userId:         user.id,
      });
    }

    // Mark active on mount (user just opened the dashboard)
    touchLastActive();
  }, [user]);

  const recordActivity = useCallback(() => {
    touchLastActive();
  }, []);

  return { recordActivity };
}
