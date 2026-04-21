// modules/billing/api.ts
import { get, post, put } from '@/lib/api';
import type {
  Subscription, UsageRecord, Payment,
  RazorpayOrder, RazorpayPaymentResponse,
  UpgradeRequest, PlanId, ResolvedLimits,
  GuidedAIContent, AISearchResult,
} from './types';

// ─── Subscription ─────────────────────────────────────────────────────────────

export const subscriptionApi = {
  current: () => get<Subscription>('/billing/subscription'),
  history: () => get<Subscription[]>('/billing/subscription/history'),
};

// ─── Usage ────────────────────────────────────────────────────────────────────

export const usageApi = {
  current: () => get<UsageRecord>('/billing/usage/current'),
  month:   (month: string) => get<UsageRecord>(`/billing/usage/${month}`),
  history: (months = 6)    => get<UsageRecord[]>('/billing/usage/history', { months }),
};

// ─── Active student count (drives dynamic limits) ─────────────────────────────
// Separate endpoint — lightweight, returns a single number.
// Cached server-side and refreshed on student create/delete.

export const studentCountApi = {
  active: () => get<{ count: number }>('/students/count/active'),
};

// ─── Resolved limits (pre-computed by server for the current tenant) ──────────
// Optional: use this for SSR or to skip client-side limitEngine computation.

export const resolvedLimitsApi = {
  current: () => get<ResolvedLimits>('/billing/limits/resolved'),
};

// ─── Payments ─────────────────────────────────────────────────────────────────

export const paymentApi = {
  list: ()                 => get<Payment[]>('/billing/payments'),
  get:  (id: string)       => get<Payment>(`/billing/payments/${id}`),
};

// ─── Upgrade ──────────────────────────────────────────────────────────────────

export const upgradeApi = {
  createRazorpayOrder: (req: Pick<UpgradeRequest, 'planId' | 'cycle'>) =>
    post<RazorpayOrder>('/billing/upgrade/razorpay/order', req),

  verifyRazorpayPayment: (payload: RazorpayPaymentResponse & { planId: PlanId; cycle: string }) =>
    post<Subscription>('/billing/upgrade/razorpay/verify', payload),

  requestCashUpgrade: (req: UpgradeRequest & { cycle: string }) =>
    post<{ subscriptionId: string; message: string }>('/billing/upgrade/cash', req),
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const billingAdminApi = {
  assignPlan: (tenantId: string, planId: PlanId, endDate?: string) =>
    put<Subscription>(`/admin/billing/${tenantId}/plan`, { planId, endDate }),

  confirmCashPayment: (tenantId: string, subscriptionId: string, transactionRef?: string) =>
    post<Subscription>(`/admin/billing/${tenantId}/cash/confirm`, { subscriptionId, transactionRef }),

  resetUsage: (tenantId: string, limitKey: string) =>
    post<UsageRecord>(`/admin/billing/${tenantId}/usage/reset`, { limitKey }),

  expiring: (days = 7) =>
    get<{ tenant: { id: string; name: string }; subscription: Subscription }[]>(
      '/admin/billing/expiring', { days }
    ),
};

// ─── Limit pre-flight ─────────────────────────────────────────────────────────

export const limitApi = {
  check: (resource: string, quantity = 1) =>
    post<{ allowed: boolean; used: number; limit: number; pct: number }>(
      '/billing/limit/check', { resource, quantity }
    ),
};

// ─── AI — Guided content (teacher-generated, student-searchable) ──────────────

export const guidedAiApi = {
  /** List all content created by teachers in this tenant */
  list: (params?: { subject?: string; topic?: string }) =>
    get<GuidedAIContent[]>('/ai/guided-content', params),

  /** Teacher creates or edits a guided AI content entry */
  upsert: (d: Pick<GuidedAIContent, 'subject' | 'topic' | 'content'> & { id?: string }) =>
    post<GuidedAIContent>('/ai/guided-content', d),

  /** Delete a guided content entry */
  delete: (id: string) =>
    post<void>('/ai/guided-content/delete', { id }),

  /**
   * Student searches for content semantically.
   * Server runs embedding → cosine similarity.
   * Returns best match or { found: false } if similarity < threshold.
   */
  search: (query: string) =>
    post<{ result: AISearchResult | null; found: boolean }>(
      '/ai/guided-content/search', { query }
    ),
};

// ─── AI — Gemini Flash (Advanced plan only) ───────────────────────────────────

export const geminiApi = {
  /** Daily quota check — returns remaining queries for today */
  quotaStatus: () =>
    get<{ used: number; limit: number; resetAt: string }>('/ai/gemini/quota'),

  /**
   * Send a Gemini Flash query (doubt solving).
   * Server enforces daily_limit = activeStudents / 2.
   * Returns 429 if quota exceeded.
   */
  query: (prompt: string, context?: string) =>
    post<{ answer: string; tokensUsed: number }>('/ai/gemini/query', { prompt, context }),
};

// ─── Storage (R2) ─────────────────────────────────────────────────────────────

export const storageApi = {
  /** Presigned URL for uploading study material (Academic+) */
  studyMaterialUploadUrl: (fileName: string, sizeBytes: number) =>
    post<{ uploadUrl: string; fileKey: string }>('/storage/study-material/upload-url', {
      fileName, sizeBytes,
    }),

  /** Presigned URL for uploading a recording (Advanced only) */
  recordingUploadUrl: (fileName: string, sizeBytes: number) =>
    post<{ uploadUrl: string; fileKey: string }>('/storage/recordings/upload-url', {
      fileName, sizeBytes,
    }),

  /** Confirm upload completed — server updates usage counter */
  confirmUpload: (fileKey: string, type: 'study_material' | 'recording') =>
    post<{ storageUsedMb: number }>('/storage/confirm', { fileKey, type }),
};
