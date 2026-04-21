// hooks/useRoles.ts
'use client';
// ─────────────────────────────────────────────────────────────────────────────
// useRoles — reads the current user's role from the auth store.
// UserRole is imported from types/auth.ts — no local redefinition.
// ─────────────────────────────────────────────────────────────────────────────

import { useAuthStore } from '@/store/auth.store';
import type { UserRole } from '@/types/auth';

export function useRoles() {
  const user = useAuthStore((s) => s.user);
  const role: UserRole = user?.role ?? 'staff';

  return {
    role,
    isSuperAdmin: role === 'superadmin',
    isAdmin:      role === 'admin' || role === 'superadmin',
    isTeacher:    role === 'teacher',
    isStaff:      role === 'staff',
    hasRole:      (r: UserRole): boolean => role === r,
  };
}
