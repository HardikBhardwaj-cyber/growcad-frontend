// server/lib/jwt.ts
// JWT sign / verify. Payload carries userId, tenantId, role, sessionId.
// 7-day access tokens. Stateless — no session store required.

import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import type { UserRole } from '@/server/types/auth';


const SECRET = process.env.JWT_SECRET!;
if (!SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET env var is required in production');
}
const FALLBACK = 'dev_secret_change_in_production';
const KEY = SECRET ?? FALLBACK;

export interface TokenPayload {
  userId:    string;
  tenantId:  string | null;
  role:      UserRole;
  sessionId: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, KEY, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, KEY) as TokenPayload;
}

export function tryVerifyToken(token: string): TokenPayload | null {
  try { return verifyToken(token); }
  catch { return null; }
}

export function makeSessionId(): string {
  return randomUUID();
}
