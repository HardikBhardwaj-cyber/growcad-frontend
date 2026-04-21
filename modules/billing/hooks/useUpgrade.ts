// modules/billing/hooks/useUpgrade.ts
'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Upgrade flow hooks — Razorpay (auto-activate) + Cash (pending, admin confirms).
//
// Razorpay flow:
//   1. Call POST /billing/upgrade/razorpay/order  → receive { orderId, amount, currency, keyId }
//   2. Lazy-load the Razorpay checkout SDK
//   3. Open the checkout modal
//   4. On success: call POST /billing/upgrade/razorpay/verify (HMAC verification)
//   5. Invalidate subscription + usage cache → UI reflects new plan immediately
//
// Cash flow:
//   1. Call POST /billing/upgrade/cash → backend creates pending subscription
//   2. Admin manually confirms via superadmin panel → subscription activates
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import { useQueryClient }        from '@tanstack/react-query';
import { upgradeApi }            from '../api';
import { BILLING_KEYS }          from './useBilling';
import { useToast }              from '@/components/ui/Toast';
import { analytics }             from '@/lib/analytics';
import type { PlanId, BillingCycle, RazorpayPaymentResponse } from '../types';

// ─── Razorpay SDK types ───────────────────────────────────────────────────────
// The Razorpay checkout.js SDK is loaded lazily via a <script> tag.
// We declare the constructor on Window so the call site is fully typed.

interface RazorpayHandler {
  open(): void;
}

interface RazorpayConstructorOptions {
  key:         string;
  amount:      number;
  currency:    string;
  name:        string;
  description: string;
  order_id:    string;
  handler:     (response: RazorpayPaymentResponse) => void;
  theme?:      { color?: string };
  modal?:      { ondismiss?: () => void };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayConstructorOptions) => RazorpayHandler;
  }
}

// ─── Shared hook interface ────────────────────────────────────────────────────
type UpgradeHookResult = {
  upgrade: () => Promise<void>;
  loading: boolean;
  error: string | null;
};


// ─── SDK loader ───────────────────────────────────────────────────────────────
// Appends the Razorpay script once. Resolves immediately if already loaded.

const RAZORPAY_CDN = 'https://checkout.razorpay.com/v1/checkout.js';

function loadRazorpaySdk(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Razorpay checkout is only available in the browser.'));
      return;
    }

    // Already loaded — resolve immediately
    if (window.Razorpay) {
      resolve();
      return;
    }

    // Avoid duplicate script tags if a previous call is still loading
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_CDN}"]`,
    );
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new Error('Razorpay SDK failed to load.')),
      );
      return;
    }

    const script    = document.createElement('script');
    script.src      = RAZORPAY_CDN;
    script.async    = true;
    script.onload   = () => resolve();
    script.onerror  = () => reject(new Error('Razorpay SDK failed to load.'));
    document.head.appendChild(script);
  });
}

// ─── useRazorpayUpgrade ───────────────────────────────────────────────────────

/**
 * Opens the Razorpay checkout modal for a plan upgrade.
 *
 * @param planId  Target plan to upgrade to.
 * @param cycle   Billing cycle for the upgrade.
 * @param onSuccess  Optional callback fired after the backend confirms payment.
 *
 * @example
 *   const { upgrade, loading, error } = useRazorpayUpgrade({
 *     planId: 'academic',
 *     cycle:  'monthly',
 *     onSuccess: () => router.push('/billing'),
 *   });
 */
export function useRazorpayUpgrade(options: {
  planId:     PlanId;
  cycle:      BillingCycle;
  onSuccess?: () => void;
}): UpgradeHookResult {
  const { planId, cycle, onSuccess } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const qc    = useQueryClient();
  const toast = useToast();

  const upgrade = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: load the Razorpay checkout SDK (no-op if already loaded)
      await loadRazorpaySdk();

      // Step 2: create an order on our backend
      const order = await upgradeApi.createRazorpayOrder({ planId, cycle });

      // Step 3: open the checkout modal and wait for user to pay or dismiss
      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key:         order.keyId,
          amount:      order.amount,
          currency:    order.currency,
          name:        'Growcad',
          description: `Upgrade to ${planId} plan`,
          order_id:    order.orderId,
          theme:       { color: '#7c3aed' },
          modal:       { ondismiss: () => reject(new Error('Payment cancelled.')) },

          handler: async (response: RazorpayPaymentResponse) => {
            try {
              // Step 4: verify HMAC signature on our backend; activates subscription
              await upgradeApi.verifyRazorpayPayment({ ...response, planId, cycle });

              // Step 5: refresh cached billing state
              await Promise.all([
                qc.invalidateQueries({ queryKey: BILLING_KEYS.subscription }),
                qc.invalidateQueries({ queryKey: BILLING_KEYS.usage }),
              ]);

              analytics.event('plan_upgrade', {
                plan:   planId,
                method: 'razorpay',
                cycle,
                amount: order.amount / 100,
              });

              toast.success(
                'Plan upgraded!',
                `You are now on the ${planId} plan.`,
              );

              onSuccess?.();
              resolve();
            } catch (verifyError) {
              reject(
                new Error(
                  verifyError instanceof Error
                    ? verifyError.message
                    : 'Payment verification failed. Please contact support.',
                ),
              );
            }
          },
        });

        rzp.open();
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Payment failed. Please try again.';

      setError(message);

      // Don't surface a toast for intentional dismissals
      if (message !== 'Payment cancelled.') {
        toast.error('Payment failed', message);
        analytics.error('razorpay_upgrade', err);
      }
    } finally {
      setLoading(false);
    }
  }, [planId, cycle, qc, toast, onSuccess]);

  return { upgrade, loading, error };
}

// ─── useCashUpgrade ───────────────────────────────────────────────────────────

/**
 * Submits a cash upgrade request. The subscription remains pending until an
 * admin manually confirms receipt of payment in the superadmin panel.
 *
 * @param planId  Target plan to upgrade to.
 * @param cycle   Billing cycle for the upgrade.
 * @param notes   Optional payment reference or notes for the admin.
 * @param onSuccess  Optional callback fired after the request is submitted.
 *
 * @example
 *   const { upgrade, loading, error } = useCashUpgrade({
 *     planId: 'advanced',
 *     cycle:  'annual',
 *   });
 */
export function useCashUpgrade(options: {
  planId:     PlanId;
  cycle:      BillingCycle;
  notes?:     string;
  onSuccess?: () => void;
}): UpgradeHookResult {
  const { planId, cycle, notes, onSuccess } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const qc    = useQueryClient();
  const toast = useToast();

  const upgrade = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await upgradeApi.requestCashUpgrade({
        planId,
        method: 'cash',
        cycle,
        notes,
      });

      await qc.invalidateQueries({ queryKey: BILLING_KEYS.subscription });

      analytics.event('plan_selected', {
        plan:   planId,
        method: 'cash',
        cycle,
      });

      toast.info(
        'Request submitted',
        "Your upgrade request is pending admin approval. You'll be notified once confirmed.",
      );

      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Could not submit upgrade request. Please try again.';

      setError(message);
      toast.error('Request failed', message);
      analytics.error('cash_upgrade', err);
    } finally {
      setLoading(false);
    }
  }, [planId, cycle, notes, qc, toast, onSuccess]);

  return { upgrade, loading, error };
}
