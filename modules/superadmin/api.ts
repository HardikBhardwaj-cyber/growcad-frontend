import { get } from "@/lib/api";

/* =========================
   TYPES
========================= */

export type AdminStats = {
  totalTenants: number;
  activeSubs: number;
  totalStudents: number;
  totalRevenueRupees: number;
  pendingCashApprovals: number;
  recentSignups: {
    id: string;
    name: string;
    createdAt: string;
    plan: string;
  }[];
};

export type ExpiringItem = {
  tenant: {
    id: string;
    name: string;
  };
  subscription: {
    planId: string;
  };
  daysLeft: number;
};

/* =========================
   API
========================= */

export const superadminApi = {
  stats: async (): Promise<AdminStats> => {
    return get<AdminStats>("/admin/stats");
  },

  billing: {
    expiring: async (days: number): Promise<ExpiringItem[]> => {
      return get<ExpiringItem[]>(`/admin/billing/expiring?days=${days}`);
    },
  },
};