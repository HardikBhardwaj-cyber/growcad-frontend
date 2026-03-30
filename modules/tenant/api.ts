import { api } from "@/lib/api";

// ✅ TYPE
export type Tenant = {
  id: string;
  name: string;
  subdomain: string;
  revenue: number;
  is_active: boolean;

  peak_students: number;
  extra_students: number;
  pending_amount: number;

  sms_used: number;
  sms_limit: number;
  wa_used: number;
  wa_limit: number;
  storage_used: number;

  plan: "basic" | "academic" | "advanced";

  ai_enabled: boolean;
  whatsapp_enabled: boolean;
};

// ✅ GET TENANTS
export const getTenants = async (): Promise<Tenant[]> => {
  const res = await api.get<Tenant[]>("/admin/tenants");
  return res.data;
};

// ✅ UPDATE TENANT
export const updateTenant = async (
  id: string,
  data: Partial<Tenant>
): Promise<Tenant> => {
  const res = await api.put<Tenant>(
    `/admin/tenant/${id}`,
    data
  );
  return res.data;
};


// ========================================
// 🔥 ADD THESE (YOUR MISSING PART)
// ========================================

// ✅ CREATE TENANT (USED IN ONBOARDING)
export const createTenant = async (data: {
  name: string;
  subdomain: string;
  plan: string;
}): Promise<Tenant> => {
  const res = await api.post<Tenant>("/tenant", data);
  return res.data;
};

// ✅ CHECK SUBDOMAIN
export const checkSubdomain = async (
  subdomain: string
): Promise<{ available: boolean }> => {
  const res = await api.get<{ available: boolean }>(
    `/tenant/check?subdomain=${subdomain}`
  );
  return res.data;
};