// lib/analytics.ts
// ─────────────────────────────────────────────────────────────────────────────
// GrowCAD Analytics — event tracking core.
//
// Architecture:
//   Provider-agnostic: the sink() function ships events to whatever backend
//   is configured (Segment, PostHog, custom API, or all three). Swap sinks
//   without touching any callsite.
//
//   All calls are SSR-safe: every browser access is guarded by
//   typeof window !== 'undefined'.
//
//   Deduplication: a sliding 500ms window collapses identical events.
//   Rapid double-clicks on a CTA produce one event, not two.
//
// Event schema:
//   { name, userId?, sessionId, timestamp, metadata? }
// ─────────────────────────────────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export type EventName =
  | 'page_view'
  | 'session_start'
  | 'signup'
  // Funnel
  | 'signup_started'
  | 'signup_completed'
  | 'otp_sent'
  | 'otp_verified'
  | 'onboarding_step'
  | 'onboarding_completed'
  | 'login'
  | 'logout'
  // CTAs
  | 'cta_click'
  | 'plan_selected'
  | 'plan_upgrade'
  // Product actions
  | 'student_created'
  | 'fee_recorded'
  | 'attendance_marked'
  | 'report_exported'
  | 'ai_query'
  | 'message_sent'
  // Retention
  | 'feature_used'
  | 'feature_idle'
  | 'onboarding_resumed'
  // Errors
  | 'api_error'
  | 'client_error';

export interface AnalyticsEvent {
  name:       EventName;
  userId?:    string;
  sessionId:  string;
  timestamp:  number;
  metadata?:  Record<string, unknown>;
}

export interface UserTraits {
  name?:       string;
  email?:      string;
  phone?:      string;
  role?:       string;
  tenantId?:   string | null;
  plan?:       string;
  createdAt?:  string;
}

// ─── Session ID ───────────────────────────────────────────────────────────────
// Generated once per browser session (sessionStorage, not localStorage).
// Cleared when the tab closes. Used to group events within a single visit.

function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  const KEY = 'gc_sid';
  let sid = sessionStorage.getItem(KEY);
  if (!sid) {
    sid = `${Date.now().toString(36)}.${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(KEY, sid);
  }
  return sid;
}

// ─── Deduplication ────────────────────────────────────────────────────────────
// Key: `eventName:JSON(metadata)`. If the same key fires within 500ms,
// the second call is dropped. Prevents double-fire from React StrictMode
// double-invocation and rapid CTA clicks.

const _recentEvents = new Map<string, number>();
const DEDUP_WINDOW_MS = 500;

function isDuplicate(name: EventName, metadata?: Record<string, unknown>): boolean {
  const key = `${name}:${JSON.stringify(metadata ?? {})}`;
  const last = _recentEvents.get(key);
  const now  = Date.now();
  if (last && now - last < DEDUP_WINDOW_MS) return true;
  _recentEvents.set(key, now);
  // Prune stale keys to prevent unbounded growth
  if (_recentEvents.size > 200) {
    for (const [k, t] of _recentEvents) {
      if (now - t > DEDUP_WINDOW_MS * 10) _recentEvents.delete(k);
    }
  }
  return false;
}

// ─── Current userId ───────────────────────────────────────────────────────────
// Lazily read from Zustand store. Not imported at module level to avoid
// circular dependency (store → axios → analytics → store).

function getCurrentUserId(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    // Read from localStorage key used by auth.store.ts persist
    const raw = localStorage.getItem('gc_auth');
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { state?: { user?: { id?: string } } };
    return parsed?.state?.user?.id;
  } catch {
    return undefined;
  }
}

// ─── Sinks ────────────────────────────────────────────────────────────────────
// Each sink receives a fully formed AnalyticsEvent.
// Add / remove sinks here without touching event callsites.

type Sink = (event: AnalyticsEvent) => void;

const sinks: Sink[] = [
  // ── Console (dev only) ──────────────────────────────────────────────────────
  process.env.NODE_ENV === 'development'
  ? (e: AnalyticsEvent) => console.debug('[analytics]', e.name, e.metadata ?? '')
  : null,

  // ── PostHog ─────────────────────────────────────────────────────────────────
  // Uncomment and set NEXT_PUBLIC_POSTHOG_KEY to enable.
  // (e) => {
  //   if (typeof window !== 'undefined' && (window as any).posthog) {
  //     (window as any).posthog.capture(e.name, { ...e.metadata, $session_id: e.sessionId });
  //   }
  // },

  // ── Custom API ──────────────────────────────────────────────────────────────
  // Fire-and-forget to your own /api/events endpoint.
  // (e) => {
  //   navigator.sendBeacon('/api/events', JSON.stringify(e));
  // },
].filter(Boolean) as Sink[];

// ─── Core dispatch ────────────────────────────────────────────────────────────

function dispatch(name: EventName, metadata?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return; // SSR safe
  if (isDuplicate(name, metadata))  return; // dedup

  const ev: AnalyticsEvent = {
    name,
    userId:    getCurrentUserId(),
    sessionId: getSessionId(),
    timestamp: Date.now(),
    metadata,
  };

  for (const sink of sinks) {
    try { sink(ev); } catch { /* one failing sink must not break others */ }
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Track a product event.
 *
 * @example
 * analytics.event('cta_click', { location: 'hero', label: 'Start Free' });
 */
function event(name: EventName, metadata?: Record<string, unknown>): void {
  dispatch(name, metadata);
}

/**
 * Identify the current user. Call after successful login or signup.
 * Stores traits in sessionStorage so they're attached to subsequent events.
 */
function identify(userId: string, traits: UserTraits): void {
  if (typeof window === 'undefined') return;
  // Store for retrieval — not used in dispatch above since we lazy-read userId
  try {
    sessionStorage.setItem('gc_user_traits', JSON.stringify({ userId, ...traits }));
  } catch { /* quota exceeded — non-fatal */ }
  // Notify sinks
  dispatch('session_start', { userId, ...traits });
}

/**
 * Track a page view. Call from a useEffect in each page,
 * or from usePathname listener in a layout.
 */
function page(path: string, metadata?: Record<string, unknown>): void {
  dispatch('page_view', { path, ...metadata });
}

/**
 * Track a CTA click with location context.
 * Location should identify where in the product the CTA appears.
 */
function cta(location: string, label: string, metadata?: Record<string, unknown>): void {
  dispatch('cta_click', { location, label, ...metadata });
}

/**
 * Track a feature interaction.
 * Called automatically by useFeatureTracking hook.
 */
function feature(featureName: string, action: 'used' | 'idle'): void {
  dispatch(action === 'used' ? 'feature_used' : 'feature_idle', { feature: featureName });
}

/**
 * Track an API or client error for alerting / Sentry routing.
 */
function error(context: string, err: unknown): void {
  const message = err instanceof Error ? err.message : String(err);
  dispatch('client_error', { context, message });
}

export const analytics = { event, identify, page, cta, feature, error };
