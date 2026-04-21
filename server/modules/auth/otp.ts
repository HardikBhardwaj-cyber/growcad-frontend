// server/modules/auth/otp.ts
// ─────────────────────────────────────────────────────────────────────────────
// OTP delivery adapter — MSG91 (primary) with console fallback in dev.
// Abstract interface: swapping providers means changing this file only.
// ─────────────────────────────────────────────────────────────────────────────

interface OtpSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID!;
const MSG91_AUTH_KEY    = process.env.MSG91_AUTH_KEY!;
const IS_DEV            = process.env.NODE_ENV !== 'production';

export async function sendOtp(
  phone: string,
  code:  string,
): Promise<OtpSendResult> {
  // ── Dev: log to console, don't hit external API ────────────────────────────
  if (IS_DEV || !MSG91_AUTH_KEY) {
    console.log(`[OTP DEV] Phone: ${phone} → Code: ${code}`);
    return { success: true, messageId: 'dev-mock' };
  }

  // ── Production: MSG91 OTP API ─────────────────────────────────────────────
  try {
    const res = await fetch('https://control.msg91.com/api/v5/otp', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'authkey':        MSG91_AUTH_KEY,
      },
      body: JSON.stringify({
        template_id: MSG91_TEMPLATE_ID,
        mobile:      `91${phone.replace(/\D/g, '').slice(-10)}`,
        otp:          code,
      }),
    });

    const data = await res.json();
    if (data.type === 'success') {
      return { success: true, messageId: data.request_id };
    }
    return { success: false, error: data.message ?? 'MSG91 error' };
  } catch (err) {
    console.error('[OTP send error]', err);
    return { success: false, error: 'Failed to send OTP' };
  }
}
