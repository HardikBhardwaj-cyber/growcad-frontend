// modules/auth/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// Auth API client — all shapes imported from types/auth.ts.
// No local interface duplicates AuthResult or SignupResult.
// ─────────────────────────────────────────────────────────────────────────────

import { post, put, get }                from '@/lib/api';
import type { AuthResult, SignupResult } from '@/types/auth';

export type { AuthResult, SignupResult };

export const authApi = {
  signup: (d: {
    name:      string;
    email:     string;
    phone:     string;
    institute: string;
  }) => post<SignupResult>('/auth/signup', d),

  login: (d: {
    email:    string;
    password: string;
  }) => post<AuthResult>('/auth/login', d),

  sendOtp: (phone: string) =>
    post('/auth/otp', { phone }),

  verifyOtp: (d: {
    phone: string;
    otp:   string;
  }) => put<AuthResult>('/auth/otp/verify', d),

  me: () => get<AuthResult['user']>('/auth/me'),

  logout: () => post('/auth/logout'),

  onboarding: (d: {
    institute: string;
    students:  string;
    course:    string;
  }) => post('/auth/onboarding', d),
};
