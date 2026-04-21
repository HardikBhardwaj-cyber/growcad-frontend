// store/tenant.store.ts
// ─────────────────────────────────────────────────────────────────────────────
// Zustand tenant store — uses AuthTenant from types/auth.ts.
//
// AuthTenant is the minimal shape available at login time (id, slug, name).
// It does not require features[], subscriptionStatus, or any billing fields
// because those are loaded asynchronously after the dashboard mounts.
//
// window.gc_tenant is declared in types/global.d.ts — no cast needed here.
// ─────────────────────────────────────────────────────────────────────────────

import { create }  from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthTenant, TenantStoreState } from '@/types/auth';

// ─── Actions ─────────────────────────────────────────────────────────────────

type TenantActions = {
  setTenant:   (tenant: AuthTenant) => void;
  clearTenant: () => void;
};

type TenantStore = TenantStoreState & TenantActions;

// ─── Store ────────────────────────────────────────────────────────────────────

export const useTenantStore = create<TenantStore>()(
  persist(
    (set) => ({
      // ── State ────────────────────────────────────────────────────────────────
      tenant: null,

      // ── Actions ──────────────────────────────────────────────────────────────
      setTenant: (tenant) => {
        set({ tenant });
        // Populate the global so axios can read x-tenant-id without importing
        // the store (which would create a circular dependency).
        // window.gc_tenant is typed in types/global.d.ts — no cast required.
        if (typeof window !== 'undefined') {
          window.gc_tenant = tenant.id;
        }
      },

      clearTenant: () => {
        set({ tenant: null });
        if (typeof window !== 'undefined') {
          window.gc_tenant = undefined;
        }
      },
    }),
    {
      name: 'gc_tenant',
      partialize: (s): TenantStoreState => ({ tenant: s.tenant }),
    },
  ),
);
