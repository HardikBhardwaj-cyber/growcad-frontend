// modules/billing/types.ts
// Single source of truth for all billing, plan, usage, storage, and AI types.
// UPDATED: Phase 6.5 → dynamic per-student limits + storage tiers + AI quotas.

// ─── Plan names ───────────────────────────────────────────────────────────────

export type PlanId = 'basic' | 'academic' | 'advanced' | 'enterprise';
export type BillingCycle = 'monthly' | 'annual';

// ─── Feature keys ─────────────────────────────────────────────────────────────

export const FEATURE = {
  STUDENT_MANAGEMENT:     'student_management',
  BATCH_MANAGEMENT:       'batch_management',
  SMART_ATTENDANCE:       'smart_attendance',
  SMS_ALERTS:             'sms_alerts',
  WHATSAPP_NOTIFICATIONS: 'whatsapp_notifications',
  FEE_MANAGEMENT:         'fee_management',
  AUTO_FEE_REMINDERS:     'auto_fee_reminders',
  ANNOUNCEMENTS:          'announcements',
  TEACHER_MANAGEMENT:     'teacher_management',
  TEST_OFFLINE:           'test_offline',
  TEST_ONLINE:            'test_online',
  LIVE_CLASSES:           'live_classes',
  STUDY_MATERIAL:         'study_material',
  RECORDED_LECTURES:      'recorded_lectures',
  STRUCTURED_VIDEO:       'structured_video',
  AI_DOUBT_SOLVING:       'ai_doubt_solving',
  AI_WORKSPACE:           'ai_workspace',       // Google Workspace AI (admin/teacher)
  AI_GEMINI_FLASH:        'ai_gemini_flash',    // Advanced only: daily = students/2
  GUIDED_AI_CONTENT:      'guided_ai_content',  // Teacher-generated, student-searchable
  WHATSAPP_MARKETING:     'whatsapp_marketing',
  CUSTOM_EMAIL:           'custom_email',
  CUSTOM_DOMAIN:          'custom_domain',
  DASHBOARD_STANDARD:     'dashboard_standard',
  DASHBOARD_CUSTOM:       'dashboard_custom',
  REPORTS_STANDARD:       'reports_standard',
  REPORTS_ADVANCED:       'reports_advanced',
  RECORDING_STORAGE:      'recording_storage',  // R2, Advanced only, 800MB/student cap
  STUDY_MATERIAL_STORAGE: 'study_material_storage', // R2, Academic+
} as const;

export type FeatureKey = typeof FEATURE[keyof typeof FEATURE];

// ─── Per-student limits (scale with active student count) ─────────────────────
// These are the RATES — multiply by active students to get total monthly limit.

export interface PerStudentLimits {
  sms:               number; // messages per student per month
  whatsappUtility:   number; // messages per student per month
  whatsappMarketing: number; // messages per student per month (0 = blocked)
  emails:            number; // emails per student per month
  studyMaterialMb:   number; // MB of study material storage per student per YEAR
                             // (accumulates monthly: yearly/12 per month)
}

// ─── Static usage limits (NOT per-student — fixed per plan) ──────────────────

export interface StaticLimits {
  /** R2 recording storage cap PER STUDENT in MB (Advanced only: 800MB) */
  recordingMbPerStudent: number;
  /** Gemini Flash daily query cap = activeStudents / geminiDivisor (Advanced: 2) */
  geminiDivisor: number;
}

// ─── Storage tier: base recording storage by student count bracket ────────────
// Used to calculate base_recording_storage before per-student add-on.

export interface StorageTier {
  minStudents: number; // lower bound (inclusive)
  maxStudents: number; // upper bound (inclusive), Infinity for last tier
  baseGb:      number; // base monthly recording storage allocation
}

// ─── Combined plan definition ─────────────────────────────────────────────────

export interface Plan {
  id:               PlanId;
  name:             string;
  description:      string;
  priceMonthly:     number;  // INR
  priceAnnual:      number;  // INR
  features:         FeatureKey[];
  perStudentLimits: PerStudentLimits;
  staticLimits:     StaticLimits;
  badge?:           string;
}

// ─── Subscription ─────────────────────────────────────────────────────────────

export type SubscriptionStatus = 'active' | 'expired' | 'pending' | 'cancelled';
export type PaymentMethod      = 'razorpay' | 'cash';

export interface Subscription {
  id:            string;
  tenantId:      string;
  planId:        PlanId;
  status:        SubscriptionStatus;
  cycle:         BillingCycle;
  startDate:     string;
  endDate:       string;
  autoRenew:     boolean;
  paymentMethod: PaymentMethod;
  createdAt:     string;
}

// ─── Dynamic limit resolution (computed, not stored) ─────────────────────────
// The result of computing: perStudentRate × effectiveStudents

export interface ResolvedLimits {
  sms:                     number;
  whatsappUtility:         number;
  whatsappMarketing:       number;
  emails:                  number;
  studyMaterialStorageMb:  number; // cumulative so far this month
  recordingStorageMb:      number; // base tier + (students × 800MB)
  geminiDailyQueries:      number; // students / 2 (Advanced only)
  // Metadata for display
  activeStudents:          number;
  effectiveStudents:       number; // with 1.1× annual bonus applied
  isAnnual:                boolean;
}

// ─── Monthly usage record (stored) ───────────────────────────────────────────

export interface UsageRecord {
  tenantId:               string;
  month:                  string;  // 'YYYY-MM'
  smsUsed:                number;
  whatsappUtilityUsed:    number;
  whatsappMarketingUsed:  number;
  emailUsed:              number;
  studyMaterialStorageMb: number;  // cumulative for this month
  recordingStorageMb:     number;  // cumulative for this month
  geminiQueriesUsedToday: number;  // resets daily
  geminiQueriesDate:      string;  // 'YYYY-MM-DD' — the date gemini counter was last reset
}

// ─── Per-limit status ─────────────────────────────────────────────────────────

export type LimitStatus = 'ok' | 'warning' | 'exceeded';

export interface LimitState {
  used:    number;
  limit:   number;
  pct:     number;      // 0–100
  status:  LimitStatus; // ok <80%, warning 80–99%, exceeded ≥100%
  label?:  string;      // human-readable context (e.g. "based on 247 students")
  resetAt?: string;
}

// ─── All metrics in one map ───────────────────────────────────────────────────

export type UsageMetricKey =
  | 'sms'
  | 'whatsappUtility'
  | 'whatsappMarketing'
  | 'emails'
  | 'studyMaterialStorageMb'
  | 'recordingStorageMb'
  | 'geminiDailyQueries';

export type UsageSummary = Record<UsageMetricKey, LimitState>;

// ─── Payment ──────────────────────────────────────────────────────────────────

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id:             string;
  tenantId:       string;
  subscriptionId: string;
  amount:         number;        // paise
  amountDisplay:  number;        // rupees
  method:         PaymentMethod;
  status:         PaymentStatus;
  transactionId?: string;
  invoiceUrl?:    string;
  notes?:         string;
  createdAt:      string;
}

export interface RazorpayOrder {
  orderId:  string;
  amount:   number;
  currency: string;
  keyId:    string;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id:   string;
  razorpay_signature:  string;
}

export interface UpgradeRequest {
  planId:  PlanId;
  method:  PaymentMethod;
  cycle:   BillingCycle;
  notes?:  string;
}

// ─── AI usage types ───────────────────────────────────────────────────────────

export interface GuidedAIContent {
  id:          string;
  tenantId:    string;
  teacherId:   string;
  subject:     string;
  topic:       string;
  content:     string;
  embedding?:  number[];  // for semantic search (stored server-side)
  createdAt:   string;
  updatedAt:   string;
}

export interface AISearchResult {
  content:    GuidedAIContent;
  similarity: number;  // 0–1
}
