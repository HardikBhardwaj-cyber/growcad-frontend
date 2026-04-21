import { get, post, put } from "@/lib/api";

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
  return await get<Tenant[]>("/admin/tenants");
};

// ✅ UPDATE TENANT
export const updateTenant = async (
  id: string,
  data: Partial<Tenant>
): Promise<Tenant> => {
  return await put<Tenant>(`/admin/tenant/${id}`, data);
};

// ✅ CREATE TENANT
export const createTenant = async (data: {
  name: string;
  subdomain: string;
  plan: string;
}): Promise<Tenant> => {
  return await post<Tenant>("/tenant", data);
};

// ✅ CHECK SUBDOMAIN
export const checkSubdomain = async (
  subdomain: string
): Promise<{ available: boolean }> => {
  return await get<{ available: boolean }>("/tenant/check", {
    subdomain,
  });
};