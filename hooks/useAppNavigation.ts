// hooks/useAppNavigation.ts
'use client';

import { useState, useCallback, useRef } from 'react';
import { analytics } from '@/lib/analytics';

// ── Route map — update APP_URL via NEXT_PUBLIC_APP_URL env var ────────────────
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.growcad.in';

const ROUTES = {
  signup:    `${APP_URL}/auth/signup`,
  login:     `${APP_URL}/auth/login`,
  dashboard: `${APP_URL}/dashboard`,
} as const;

type Route = keyof typeof ROUTES;

interface UseAppNavigation {
  navigate:  (route: Route, ctaContext?: { location: string; label?: string }) => void;
  isLoading: boolean;
}

/**
 * useAppNavigation
 *
 * Cross-domain navigation from landing → app.
 *
 *   1. Fires analytics.cta() with location + label BEFORE redirect
 *      so the event is captured even if the page exits immediately.
 *   2. Fires analytics.event('signup_started' | 'login') to enter the funnel.
 *   3. Sets isLoading → button shows spinner
 *   4. Adds .page-exit to <html> → CSS opacity:0 transition fires (360ms)
 *   5. After 380ms → window.location.href triggers hard redirect
 */
export function useAppNavigation(): UseAppNavigation {
  const [isLoading, setIsLoading] = useState(false);
  const fired = useRef(false);

  const navigate = useCallback((
    route: Route,
    ctaContext?: { location: string; label?: string },
  ) => {
    if (fired.current) return;
    fired.current = true;
    setIsLoading(true);

    // ── Fire CTA analytics synchronously before navigation ────────────────────
    // navigator.sendBeacon ensures delivery even as the page unloads.
    if (ctaContext) {
      analytics.cta(ctaContext.location, ctaContext.label ?? route);
    }
    if (route === 'signup') {
      analytics.event('signup_started', { source: ctaContext?.location });
    }
    if (route === 'login') {
      analytics.event('login', { source: ctaContext?.location });
    }

    // Trigger CSS fade-out (defined in globals.css)
    document.documentElement.classList.add('page-exit');

    setTimeout(() => {
      window.location.href = ROUTES[route];
    }, 380);
  }, []);

  return { navigate, isLoading };
}
