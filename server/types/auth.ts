export const ROLES = ['superadmin', 'admin', 'teacher', 'staff'] as const;

export type UserRole = (typeof ROLES)[number];