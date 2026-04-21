// types/auth.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for all auth-related types.
//
// Rule: every layer — API responses, Zustand stores, hooks, analytics — imports
// from HERE. Nothing duplicates these definitions. When a field changes, it
// changes in one place and TypeScript finds every broken consumer instantly.
//
// Design decisions:
//
//   AuthUser.phone  — required string (not optional).
//     The server always returns a phone number for authenticated users because
//     phone verification is mandatory in the signup flow. Optional phone on
//     the User type was a holdover from early prototyping and caused null
//     checks everywhere phone was consumed.
//
//   AuthUser.tenantId — string | null (not optional / undefined).
//     Superadmin users have tenantId = null. All other roles have a tenantId.
//     Using null (not undefined) makes the distinction explicit and prevents
//     accidental truthiness checks from treating missing-key as no-tenant.
//
//   AuthTenant — minimal shape required at login time.
//     The full Tenant shape (with features[], subscriptionStatus, etc.) lives
//     in types/index.ts and is loaded lazily after the dashboard mounts. The
//     auth flow only needs id + slug + name to wire the tenant store.
//
//   SignupResult — exactly what POST /auth/signup returns.
//     The server creates the user and returns its IDs + a pre-auth token so
//     the client can call the OTP endpoint without a second login round-trip.
//     There is no `user` object in SignupResult because the user has not yet
//     verified their phone — they are not fully authenticated.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Core user shape (returned by /auth/login and /auth/otp/verify) ──────────

export const USER_ROLES = [
  "superadmin",
  "admin",
  "teacher",
  "staff",
  "student", // ✅ ADD THIS
] as const;

export type UserRole = typeof USER_ROLES[number];

export type AuthUser = {
  id:       string;
  name:     string;
  email:    string;
  phone:    string;
  role:     UserRole;
  tenantId: string | null;
  avatar?:  string;
};

// ─── Minimal tenant shape (available immediately after login) ─────────────────

export type AuthTenant = {
  id:   string;
  slug: string;
  name: string;
};

// ─── API response shapes ──────────────────────────────────────────────────────

/** Returned by POST /auth/login and PUT /auth/otp/verify */
export type AuthResult = {
  user:  AuthUser;
  token: string;
};

/**
 * Returned by POST /auth/signup.
 * No `user` object — phone is not yet verified at this point.
 */
export type SignupResult = {
  userId:   string;
  tenantId: string;
  token:    string;
  phone:    string;
  otpSent:  boolean;
};

// ─── Store state shapes ───────────────────────────────────────────────────────

export type AuthStoreState = {
  user:            AuthUser | null;
  token:           string | null;
  isAuthenticated: boolean;
};

export type TenantStoreState = {
  tenant: AuthTenant | null;
};
