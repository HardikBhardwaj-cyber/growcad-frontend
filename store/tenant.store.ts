import { create } from "zustand";

interface TenantState {
  subdomain: string | null;
  setTenant: (subdomain: string) => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  subdomain: null,

  setTenant: (subdomain) =>
    set({ subdomain }),
}));