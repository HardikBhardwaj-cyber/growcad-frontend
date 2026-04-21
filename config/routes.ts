// config/routes.ts

// ─── App Routes (single source of truth) ─────────────────────────────
export const ROUTES = {
  dashboard: "/dashboard",
  students: "/students",
  fees: "/fees",
  attendance: "/attendance",
  communication: "/communication",
  ai: "/ai",
  billing: "/dashboard/billing", // ✅ FIXED
  admin: "/admin",
  reports: "/reports",
  
  signup: "/auth/signup",
  otp: "/auth/otp",
  login: "/auth/login"

} as const;

// ─── Role Access Control ─────────────────────────────────────────────

export const ROLE_ROUTES = {
  super_admin: [ROUTES.admin],

  institute_admin: [
    ROUTES.dashboard,
    ROUTES.students,
    ROUTES.fees,
    ROUTES.billing, // ✅ ADD HERE
    ROUTES.ai,
  ],

  faculty: [
    ROUTES.dashboard,
    ROUTES.attendance,
    ROUTES.ai,
  ],

  student: [
    ROUTES.dashboard,
  ],

  parent: [
    ROUTES.dashboard,
  ],
} as const;