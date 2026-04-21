// app/api/auth/signup/route.ts
// POST /api/auth/signup
// Creates user + tenant, sends OTP to phone for verification.

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { parseBody } from '@/server/middleware/validate';
import { checkRateLimit, API_LIMITER } from '@/server/middleware/rateLimiter';
import { createTenantAndAdmin, generateAndSaveOtp } from '@/server/modules/auth/service';
import { sendOtp } from '@/server/modules/auth/otp';
import { ok, created, conflict, badRequest, serverError } from '@/server/lib/response';
import db from '@/server/lib/db';

const signupSchema = z.object({
  name:      z.string().min(2),
  email:     z.string().email(),
  phone:     z.string().regex(/^\d{10}$/, 'Enter 10-digit mobile number'),
  institute: z.string().min(2),
});

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip    = req.headers.get('x-forwarded-for') ?? 'unknown';
  const limit = checkRateLimit(ip, { windowMs: 60_000, max: 5, keyPrefix: 'signup' });
  if (!limit.allowed) return badRequest('Too many signup attempts. Please wait 1 minute.');

  const { data, error } = await parseBody(req, signupSchema);
  if (error) return error;

  try {
    // Check email uniqueness
    const existing = await db.user.findUnique({ where: { email: data.email } });
    if (existing) return conflict('An account with this email already exists. Please sign in.');

    // Check phone uniqueness
    const existingPhone = await db.user.findUnique({ where: { phone: data.phone } });
    if (existingPhone) return conflict('This mobile number is already registered.');

    // Create tenant + admin user
    const { userId, tenantId, token } = await createTenantAndAdmin(data);

    // Generate + send OTP
    const otp = await generateAndSaveOtp(data.phone);
    const sms = await sendOtp(data.phone, otp);
    if (!sms.success) {
      console.warn('[Signup] OTP send failed:', sms.error);
      // Don't fail signup — user can request resend
    }

    return created({
      userId,
      tenantId,
      token,
      phone:      data.phone,
      otpSent:    sms.success,
      message:    `Verification code sent to +91 ${data.phone}`,
    }, 'Account created. Please verify your phone number.');
  } catch (err) {
    return serverError(err);
  }
}
