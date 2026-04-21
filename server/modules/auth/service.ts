// server/modules/auth/service.ts
// ─────────────────────────────────────────────────────────────────────────────
// Auth business logic — decoupled from HTTP layer.
// API routes call these functions; no NextRequest/Response in here.
// ─────────────────────────────────────────────────────────────────────────────

import db from '@/server/lib/db';
import { hashPassword, comparePassword } from '@/server/lib/hash';
import { signToken, makeSessionId } from '@/server/lib/jwt';
import { randomInt } from 'crypto';
import { ROLES, type UserRole } from '@/server/types/auth';

function isUserRole(role: string): role is UserRole {
  return (ROLES as readonly string[]).includes(role);
}

// ─── OTP ──────────────────────────────────────────────────────────────────────

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function generateAndSaveOtp(phone: string): Promise<string> {
  // Invalidate previous OTPs for this phone
  await db.otp.updateMany({
    where:  { phone, used: false },
    data:   { used: true },
  });

  const code      = String(randomInt(100_000, 999_999));
  const codeHash  = await hashPassword(code);  // store hashed, verify on submit

  await db.otp.create({
    data: {
      phone,
      code:      codeHash,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
      used:      false,
    },
  });

  return code; // returned to caller to pass to SMS provider
}

export async function verifyOtp(
  phone: string,
  code:  string,
): Promise<boolean> {
  const record = await db.otp.findFirst({
    where: {
      phone,
      used:      false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) return false;

  const valid = await comparePassword(code, record.code);
  if (!valid) return false;

  await db.otp.update({ where: { id: record.id }, data: { used: true } });
  return true;
}

// ─── Tenant creation (on signup) ──────────────────────────────────────────────

export async function createTenantAndAdmin(input: {
  name:      string;
  email:     string;
  phone:     string;
  institute: string;
}): Promise<{ userId: string; tenantId: string; token: string }> {
  const slug = slugify(input.institute);

  // Ensure slug is unique
  const existingSlug = await db.tenant.findUnique({ where: { slug } });
  const finalSlug    = existingSlug ? `${slug}-${Date.now()}` : slug;

  const { tenant, user } = await db.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        slug:  finalSlug,
        name:  input.institute,
        plan:  'basic',
        features: getDefaultFeatures('basic'),
      },
    });

    const user = await tx.user.create({
      data: {
        tenantId:      tenant.id,
        name:          input.name,
        email:         input.email,
        phone:         input.phone,
        role:          'admin',
        phoneVerified: false,
      },
    });

    return { tenant, user };
  });

  const token = signToken({
    userId:    user.id,
    tenantId:  tenant.id,
    role:      'admin',
    sessionId: makeSessionId(),
  });

  return { userId: user.id, tenantId: tenant.id, token };
}

export async function verifyPhoneAndActivate(
  userId: string,
): Promise<{ token: string }> {
  const user = await db.user.update({
    where: { id: userId },
    data:  {
      phoneVerified: true,
      lastLoginAt:   new Date(),
    },
    include: { tenant: true },
  });

  if (!isUserRole(user.role)) {
  throw new Error(`Invalid role from DB: ${user.role}`);
}

const token = signToken({
  userId: user.id,
  tenantId: user.tenantId,
  role: user.role, // ✅ now typed correctly
  sessionId: makeSessionId(),
});

  return { token };
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginWithEmail(
  email:    string,
  password: string,
): Promise<{ userId: string; token: string } | null> {
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) return null;

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) return null;

  await db.user.update({
    where: { id: user.id },
    data:  { lastLoginAt: new Date() },
  });

  if (!isUserRole(user.role)) {
  throw new Error(`Invalid role from DB: ${user.role}`);
}

const token = signToken({
  userId: user.id,
  tenantId: user.tenantId,
  role: user.role, // ✅ now typed correctly
  sessionId: makeSessionId(),
});

  return { userId: user.id, token };
}

// ─── Profile fetch ────────────────────────────────────────────────────────────

export async function getUserProfile(userId: string) {
  return db.user.findUnique({
    where:  { id: userId },
    select: {
      id: true, name: true, email: true, phone: true,
      role: true, tenantId: true, avatar: true, createdAt: true,
      tenant: {
        select: {
          id: true, slug: true, name: true, logo: true,
          plan: true, features: true, subscriptions: {
            where:   { status: 'active' },
            orderBy: { createdAt: 'desc' },
            take:    1,
            select:  { status: true, endDate: true, planId: true },
          },
        },
      },
    },
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getDefaultFeatures(plan: string): string[] {
  const COMMON = [
    'student_management', 'batch_management', 'smart_attendance',
    'sms_alerts', 'whatsapp_notifications', 'fee_management',
    'auto_fee_reminders', 'announcements', 'teacher_management',
    'test_offline', 'ai_workspace',
  ];
  return COMMON;
}
