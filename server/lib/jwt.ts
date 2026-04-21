// server/lib/jwt.ts
// ✅ Edge-safe JWT using JOSE (Next.js 16 compatible)
// No jsonwebtoken ❌
// Works in middleware/proxy ✅

import { jwtVerify, SignJWT, type JWTPayload } from 'jose';
import { randomUUID } from 'crypto';
import type { UserRole } from '@/server/types/auth';

// 🔐 ENV
const SECRET = process.env.JWT_SECRET;

if (!SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET env var is required in production');
}

const KEY = new TextEncoder().encode(
  SECRET ?? 'dev_secret_change_in_production'
);

// ✅ PAYLOAD TYPE
export interface TokenPayload extends JWTPayload {
  userId: string;
  tenantId: string | null;
  role: UserRole;
  sessionId: string;
}

// ✅ SIGN TOKEN
export async function signToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(KEY);
}

// ✅ VERIFY TOKEN (SAFE + STRICT)
export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, KEY);

  // 🔒 Explicit mapping (no unsafe casting)
  if (
    typeof payload.userId !== 'string' ||
    typeof payload.role !== 'string' ||
    typeof payload.sessionId !== 'string'
  ) {
    throw new Error('Invalid token payload');
  }

  return {
    userId: payload.userId,
    tenantId: (payload.tenantId as string | null) ?? null,
    role: payload.role as UserRole,
    sessionId: payload.sessionId,
  };
}

// ✅ SAFE VERIFY (NO THROW)
export async function tryVerifyToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

// ✅ SESSION ID GENERATOR
export function makeSessionId(): string {
  return randomUUID();
}