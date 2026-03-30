// =========================
// AUTH
// =========================

export type User = {
  id: string;
  name: string;
  phone: string;
  role: "admin" | "teacher" | "student" | "superadmin";
};

export type VerifyOTPResponse = {
  access_token: string;
  user: User;
};

export type VerifyOTPInput = {
  phone: string;
  otp: string;
};

// =========================
// STUDENT
// =========================

export type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  created_at?: string;
};

export type CreateStudentInput = {
  name: string;
  email: string;
  phone: string;
  course: string;
};

// =========================
// TENANT (SUPERADMIN)
// =========================

export type Tenant = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  created_at?: string;
};

export type UpdateTenantInput = {
  name?: string;
  email?: string;
  status?: "active" | "inactive";
};

// =========================
// ADMIN STATS
// =========================

export type AdminStats = {
  total_tenants: number;
  total_students: number;
  revenue: number;
};

// =========================
// GENERIC API RESPONSE (OPTIONAL)
// =========================

export type ApiResponse<T> = {
  data: T;
  message?: string;
};