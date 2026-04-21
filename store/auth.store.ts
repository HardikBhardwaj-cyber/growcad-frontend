// store/auth.store.ts
// ─────────────────────────────────────────────────────────────────────────────
// Zustand auth store — uses AuthUser from types/auth.ts.
//
// The store accepts AuthUser (from the server) and does not accept the old
// loose User type from types/index.ts. This breaks the chain that allowed
// optional phone and optional tenantId to flow through the system unchecked.
// ─────────────────────────────────────────────────────────────────────────────

import { create }  from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, AuthStoreState } from '@/types/auth';

// ─── Actions ─────────────────────────────────────────────────────────────────

type AuthActions = {
  setUser:  (user: AuthUser) => void;
  setToken: (token: string) => void;
  logout:   () => void;
};

type AuthStore = AuthStoreState & AuthActions;

// ─── Cookie helper ────────────────────────────────────────────────────────────

function writeSessionCookie(token: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = [
    `gc_session=${token}`,
    'path=/',
    'domain=.growcad.in',
    'SameSite=None',
    'Secure',
    'max-age=604800',
  ].join('; ');
}

function clearSessionCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = 'gc_session=; path=/; domain=.growcad.in; max-age=0';
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // ── State ────────────────────────────────────────────────────────────────
      user:            null,
      token:           null,
      isAuthenticated: false,

      // ── Actions ──────────────────────────────────────────────────────────────
      setUser: (user) => set({ user, isAuthenticated: true }),

      setToken: (token) => {
        set({ token });
        writeSessionCookie(token);
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        clearSessionCookie();
        // Full navigation so all in-memory state is discarded.
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      },
    }),
    {
      name: 'gc_auth',
      partialize: (s): AuthStoreState => ({
        user:            s.user,
        token:           s.token,
        isAuthenticated: s.isAuthenticated,
      }),
    },
  ),
);
