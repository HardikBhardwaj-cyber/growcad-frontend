// modules/auth/hooks/useAuth.ts
'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Auth hooks — zero `any`, zero type assertions.
//
// Type flow:
//   authApi.login()     → AuthResult       → AuthUser  → auth.store
//   authApi.verifyOtp() → AuthResult       → AuthUser  → auth.store
//   authApi.signup()    → SignupResult      (no user — phone unverified)
//
// Tenant wiring:
//   AuthUser.tenantId is string | null.
//   When tenantId is a non-null string, we construct an AuthTenant and pass it
//   to setTenant(). setTenant() expects AuthTenant — the narrowed string
//   satisfies that without any cast.
//
// Axios error handling:
//   axios.isAxiosError() is the official type-safe guard. After the guard,
//   TypeScript narrows err to AxiosError and we can access .response.data
//   with full type safety through the FieldError envelope shape.
// ─────────────────────────────────────────────────────────────────────────────

import { useState }          from 'react';
import { useRouter }         from 'next/navigation';
import axios                 from 'axios';
import { authApi }           from '../api';
import { useAuthStore }      from '@/store/auth.store';
import { useTenantStore }    from '@/store/tenant.store';
import { APP_ROUTES } from '@/config/appRoutes';
import { useToast }          from '@/components/ui/Toast';
import { analytics }         from '@/lib/analytics';
import { useFunnel }         from '@/hooks/useFunnel';
import type { AuthTenant }   from '@/types/auth';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extract a human-readable error message from an unknown catch value. */
function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    // The server returns { success: false, message: string, errors: FieldError[] }
    const data = err.response?.data as
      | { message?: string; error?: string }
      | undefined;
    return data?.message ?? data?.error ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

/**
 * Build the minimal AuthTenant object from a tenantId string.
 * This is sufficient to wire the tenant store at login time.
 * The full Tenant shape (features, plan, etc.) is loaded lazily by the dashboard.
 */
function makeTenant(tenantId: string): AuthTenant {
  return { id: tenantId, slug: '', name: '' };
}

// ─── useLogin ─────────────────────────────────────────────────────────────────

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const router             = useRouter();
  const { setUser, setToken } = useAuthStore();
  const { setTenant }         = useTenantStore();
  const toast  = useToast();

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      const { user, token } = await authApi.login({ email, password });

      setUser(user);
      setToken(token);

      // user.tenantId is string | null — narrow to string before constructing tenant
      if (user.tenantId !== null) {
        setTenant(makeTenant(user.tenantId));
      }

      analytics.identify(user.id, {
        name:     user.name,
        email:    user.email,
        role:     user.role,
        tenantId: user.tenantId,   // string | null — matches UserTraits.tenantId
      });
      analytics.event('login', { userId: user.id, role: user.role });

      toast.success('Welcome back', `Signed in as ${user.name}`);
      router.push(APP_ROUTES.dashboard);
    } catch (err) {
      const msg = extractErrorMessage(err, 'Invalid email or password. Please try again.');
      setError(msg);
      toast.error('Sign in failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

// ─── useOtpVerify ─────────────────────────────────────────────────────────────

export function useOtpVerify() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const router             = useRouter();
  const { setUser, setToken } = useAuthStore();
  const { setTenant }         = useTenantStore();
  const toast  = useToast();
  const funnel = useFunnel();

  const verify = async (phone: string, otp: string): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      const { user, token } = await authApi.verifyOtp({ phone, otp });

      setUser(user);
      setToken(token);

      if (user.tenantId !== null) {
        setTenant(makeTenant(user.tenantId));
      }

      analytics.identify(user.id, {
        name:     user.name,
        email:    user.email,
        tenantId: user.tenantId,
      });
      analytics.event('otp_verified', { userId: user.id });
      funnel.advance('otp');

      toast.success('Phone verified', 'Setting up your dashboard…');
      router.push(APP_ROUTES.onboarding);
    } catch (err) {
      const msg = extractErrorMessage(err, 'Incorrect code. Please try again.');
      setError(msg);
      toast.error('Verification failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return { verify, loading, error };
}

// ─── useSignup ────────────────────────────────────────────────────────────────

type SignupInput = {
  name:      string;
  email:     string;
  phone:     string;
  institute: string;
};

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const router           = useRouter();
  const { setToken }     = useAuthStore();
  const { setTenant }    = useTenantStore();
  const toast            = useToast();

  const signup = async (input: SignupInput): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      // SignupResult: { userId, tenantId, token, phone, otpSent }
      // No `user` object — phone verification happens next.
      const result = await authApi.signup(input);

      setToken(result.token);

      // result.tenantId is always a string on SignupResult (required field)
      setTenant(makeTenant(result.tenantId));

      analytics.event('signup', { userId: result.userId });
      toast.success('Account created', 'Please verify your phone number.');
      router.push(`${APP_ROUTES.otp}?phone=${encodeURIComponent(input.phone)}`);
    } catch (err) {
      const msg = extractErrorMessage(err, 'Signup failed. Please try again.');
      setError(msg);
      toast.error('Signup failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
}

// ─── useLogout ────────────────────────────────────────────────────────────────

export function useLogout() {
  const { logout }      = useAuthStore();
  const { clearTenant } = useTenantStore();

  return async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch {
      // Cookie is cleared server-side regardless — safe to ignore network errors.
    }
    clearTenant();
    logout();   // clears store, clears cookie, redirects to /auth/login
  };
}
