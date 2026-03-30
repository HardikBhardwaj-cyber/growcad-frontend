import { useEffect } from "react";
import { useTenantStore } from "@/store/tenant.store";

export const useTenant = () => {
  const setTenant = useTenantStore((s) => s.setTenant);

  useEffect(() => {
    const host = window.location.host;
    const subdomain = host.split(".")[0];

    if (subdomain !== "www" && subdomain !== "growcad") {
      setTenant(subdomain);
    }
  }, []);

  return useTenantStore();
};