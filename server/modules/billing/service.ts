// server/modules/billing/service.ts
// ─────────────────────────────────────────────────────────────────────────────
// Billing business logic — decoupled from HTTP.
//
// Responsibilities:
//   • Subscription lifecycle (create, activate, expire, cancel)
//   • Razorpay order creation + HMAC signature verification
//   • Cash payment pending → activation flow
//   • Invoice generation via Resend
//   • Usage record initialisation on subscription creation
//   • Billing state resolution (planId, cycle, active status)
//
// No NextRequest/Response here — pure TypeScript.
// ─────────────────────────────────────────────────────────────────────────────

import crypto from 'crypto';
import db      from '@/server/lib/db';
import { getPlan } from '@/modules/billing/plans';
import type { PlanId, BillingCycle } from '@/modules/billing/types';

// ─── Env ──────────────────────────────────────────────────────────────────────

const RZP_KEY_ID         = process.env.RAZORPAY_KEY_ID!;
const RZP_KEY_SECRET     = process.env.RAZORPAY_KEY_SECRET!;
const RZP_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';
const RESEND_API_KEY     = process.env.RESEND_API_KEY!;
const IS_DEV             = process.env.NODE_ENV !== 'production';

// ─── Internal Subscription shape (minimal select) ────────────────────────────

type SubscriptionRow = {
  id:        string;
  tenantId:  string;
  planId:    string;
  cycle:     string;
  status:    string;
  endDate:   Date;
  startDate: Date;
  paymentMethod: string;
};

// ─── Exported types ───────────────────────────────────────────────────────────

export interface SubscriptionCreateInput {
  tenantId:      string;
  planId:        PlanId;
  cycle:         BillingCycle;
  paymentMethod: 'razorpay' | 'cash';
  amountPaise:   number;
}

export interface TenantBilling {
  planId:    PlanId;
  cycle:     BillingCycle;
  isActive:  boolean;
  expiresAt: Date | null;
}

export interface BillingStatus {
  active:        boolean;
  planId:        PlanId;
  expiresInDays: number | null;
}

// ─── Time helpers ─────────────────────────────────────────────────────────────

/** Returns the current month as 'YYYY-MM'. Used as the usage record key. */
export function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

/** Returns today's date as 'YYYY-MM-DD'. */
export function currentDate(): string {
  return new Date().toISOString().slice(0, 10);
}

// ─── Subscription queries ─────────────────────────────────────────────────────

/**
 * Returns the latest active subscription for a tenant, or null if none exists.
 * Uses a minimal select to avoid fetching unused relation data.
 */
export async function getActiveSubscription(
  tenantId: string,
): Promise<SubscriptionRow | null> {
  const row = await db.subscription.findFirst({
    where:   { tenantId, status: 'active' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, tenantId: true, planId: true, cycle: true,
      status: true, endDate: true, startDate: true, paymentMethod: true,
    },
  });
  return row ?? null;
}

/**
 * Returns billing context for a tenant.
 * Falls back to basic/monthly when no active subscription exists.
 */
export async function resolveTenantBilling(
  tenantId: string,
): Promise<TenantBilling> {
  const sub = await getActiveSubscription(tenantId);

  if (!sub) {
    return { planId: 'basic', cycle: 'monthly', isActive: false, expiresAt: null };
  }

  const active = isSubscriptionActive(sub);

  return {
    planId:    coercePlanId(sub.planId),
    cycle:     coerceCycle(sub.cycle),
    isActive:  active,
    expiresAt: sub.endDate,
  };
}

/**
 * Checks whether a subscription row is currently active.
 * Both the status field and the endDate must pass.
 */
export function isSubscriptionActive(subscription: {
  status:  string;
  endDate: Date;
}): boolean {
  return subscription.status === 'active' && subscription.endDate > new Date();
}

/**
 * Returns a lightweight billing status object used by dashboard widgets and
 * feature gates. Runs a single query.
 */
export async function getBillingStatus(tenantId: string): Promise<BillingStatus> {
  const sub = await getActiveSubscription(tenantId);

  if (!sub || !isSubscriptionActive(sub)) {
    return { active: false, planId: 'basic', expiresInDays: null };
  }

  const msLeft      = sub.endDate.getTime() - Date.now();
  const expiresInDays = Math.max(0, Math.ceil(msLeft / MS_PER_DAY));

  return {
    active:        true,
    planId:        coercePlanId(sub.planId),
    expiresInDays,
  };
}

// ─── Subscription lifecycle ───────────────────────────────────────────────────

/**
 * createPendingSubscription
 * Called BEFORE payment is confirmed. Creates a pending subscription and payment record.
 * For Razorpay: subscription activates in verifyAndActivate().
 * For Cash: subscription stays pending until admin confirms.
 */
export async function createPendingSubscription(
  input: SubscriptionCreateInput,
): Promise<{ subscriptionId: string; paymentId: string }> {
  const startDate = new Date();
  const endDate   = computeEndDate(startDate, input.cycle);

  const result = await db.$transaction(async (tx) => {
    await tx.subscription.updateMany({
      where: { tenantId: input.tenantId, status: 'active' },
      data:  { status: 'cancelled' },
    });

    const sub = await tx.subscription.create({
      data: {
        tenantId:      input.tenantId,
        planId:        input.planId,
        status:        'pending',
        cycle:         input.cycle,
        startDate,
        endDate,
        autoRenew:     input.cycle === 'annual',
        paymentMethod: input.paymentMethod,
      },
    });

    const payment = await tx.payment.create({
      data: {
        tenantId:       input.tenantId,
        subscriptionId: sub.id,
        amount:         input.amountPaise,
        method:         input.paymentMethod,
        status:         'pending',
      },
    });

    return { subscriptionId: sub.id, paymentId: payment.id };
  });

  return result;
}

/**
 * activateSubscription
 * Called after payment is confirmed. Updates subscription + payment status,
 * syncs tenant plan, initialises usage record.
 */
export async function activateSubscription(
  subscriptionId: string,
  transactionId?: string,
): Promise<void> {
  await db.$transaction(async (tx) => {
    const sub = await tx.subscription.findUniqueOrThrow({
      where: { id: subscriptionId },
    });

    await tx.subscription.update({
      where: { id: subscriptionId },
      data:  { status: 'active' },
    });

    await tx.payment.updateMany({
      where: { subscriptionId, status: 'pending' },
      data:  { status: 'completed', transactionId: transactionId ?? null },
    });

    const plan = getPlan(sub.planId);
    await tx.tenant.update({
      where: { id: sub.tenantId },
      data:  { plan: sub.planId, features: plan.features as string[] },
    });

    const month = currentMonth();
    await tx.usageRecord.upsert({
      where:  { tenantId_month: { tenantId: sub.tenantId, month } },
      update: {},
      create: { tenantId: sub.tenantId, month },
    });
  });
}

/**
 * expireStaleSubscriptions
 * Called by the daily cron job. Marks expired subscriptions and downgrades tenants.
 */
export async function expireStaleSubscriptions(): Promise<number> {
  const now = new Date();

  const expired = await db.subscription.findMany({
    where:  { status: 'active', endDate: { lt: now } },
    select: { id: true, tenantId: true },
  });

  if (expired.length === 0) return 0;

  await db.$transaction(async (tx) => {
    await tx.subscription.updateMany({
      where: { id: { in: expired.map((s) => s.id) } },
      data:  { status: 'expired' },
    });

    await tx.tenant.updateMany({
      where: { id: { in: expired.map((s) => s.tenantId) } },
      data:  { plan: 'basic', features: [] },
    });
  });

  return expired.length;
}

// ─── Razorpay integration ─────────────────────────────────────────────────────

export async function createRazorpayOrder(
  amountPaise: number,
  receiptId:   string,
): Promise<{ orderId: string; amount: number; currency: string; keyId: string }> {
  if (IS_DEV && !RZP_KEY_ID) {
    return {
      orderId:  `order_dev_${Date.now()}`,
      amount:   amountPaise,
      currency: 'INR',
      keyId:    'rzp_test_mock',
    };
  }

  const credentials = Buffer.from(`${RZP_KEY_ID}:${RZP_KEY_SECRET}`).toString('base64');

  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Basic ${credentials}`,
    },
    body: JSON.stringify({
      amount:          amountPaise,
      currency:        'INR',
      receipt:         receiptId,
      payment_capture: 1,
    }),
  });

  if (!res.ok) {
    throw new Error(`Razorpay order creation failed: ${await res.text()}`);
  }

  const order = await res.json() as { id: string; amount: number; currency: string };
  return { orderId: order.id, amount: order.amount, currency: order.currency, keyId: RZP_KEY_ID };
}

export function verifyRazorpaySignature(
  orderId:   string,
  paymentId: string,
  signature: string,
): boolean {
  if (IS_DEV && orderId.startsWith('order_dev_')) return true;

  const body     = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac('sha256', RZP_KEY_SECRET).update(body).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

// ─── Invoice ─────────────────────────────────────────────────────────────────

export interface InvoiceData {
  tenantName:    string;
  adminEmail:    string;
  planName:      string;
  amount:        number;
  cycle:         BillingCycle;
  startDate:     Date;
  endDate:       Date;
  transactionId: string;
}

export async function sendInvoiceEmail(data: InvoiceData): Promise<void> {
  if (IS_DEV && !RESEND_API_KEY) return;

  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from:    'billing@growcad.in',
      to:      data.adminEmail,
      subject: `Receipt — Growcad ${data.planName} Plan`,
      html:    buildInvoiceHtml(data),
    }),
  });

  if (!res.ok) {
    // Non-fatal: invoice failure must not block subscription activation.
    void res.text();
  }
}

// ─── Exported helpers ─────────────────────────────────────────────────────────

export function planAmountPaise(planId: PlanId, cycle: BillingCycle): number {
  const plan = getPlan(planId);
  return (cycle === 'annual' ? plan.priceAnnual : plan.priceMonthly) * 100;
}

// ─── Private helpers ──────────────────────────────────────────────────────────

const MS_PER_DAY = 86_400_000;

const VALID_PLAN_IDS = new Set<PlanId>(['basic', 'academic', 'advanced']);
const VALID_CYCLES   = new Set<BillingCycle>(['monthly', 'annual']);

function coercePlanId(value: string): PlanId {
  return VALID_PLAN_IDS.has(value as PlanId) ? (value as PlanId) : 'basic';
}

function coerceCycle(value: string): BillingCycle {
  return VALID_CYCLES.has(value as BillingCycle) ? (value as BillingCycle) : 'monthly';
}

function computeEndDate(start: Date, cycle: BillingCycle): Date {
  const end = new Date(start);
  if (cycle === 'annual') {
    end.setFullYear(end.getFullYear() + 1);
  } else {
    end.setMonth(end.getMonth() + 1);
  }
  return end;
}

function buildInvoiceHtml(d: InvoiceData): string {
  const fmt     = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);
  const fmtDate = (dt: Date) =>
    dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{font-family:-apple-system,sans-serif;background:#f9f9f9;padding:32px}
    .card{background:#fff;border-radius:12px;padding:32px;max-width:480px;margin:0 auto}
    .logo{font-size:20px;font-weight:700;color:#7c3aed;margin-bottom:24px}
    .label{font-size:12px;color:#888;text-transform:uppercase;letter-spacing:.08em}
    .value{font-size:15px;color:#111;margin:2px 0 16px}
    .amount{font-size:32px;font-weight:700;color:#111;margin:16px 0}
    .footer{font-size:12px;color:#aaa;margin-top:24px}
    hr{border:0;border-top:1px solid #eee;margin:20px 0}
  </style></head><body><div class="card">
    <div class="logo">Growcad</div>
    <p>Your subscription is now active. Thank you!</p><hr>
    <div class="label">Institute</div><div class="value">${d.tenantName}</div>
    <div class="label">Plan</div>
    <div class="value">${d.planName} (${d.cycle === 'annual' ? 'Annual' : 'Monthly'})</div>
    <div class="label">Amount paid</div><div class="amount">${fmt(d.amount)}</div>
    <div class="label">Valid</div>
    <div class="value">${fmtDate(d.startDate)} → ${fmtDate(d.endDate)}</div>
    <div class="label">Transaction ID</div>
    <div class="value" style="font-family:monospace;font-size:12px">${d.transactionId}</div>
    <hr><div class="footer">Growcad · support@growcad.in</div>
  </div></body></html>`;
}
