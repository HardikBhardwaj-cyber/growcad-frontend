import { useAuthStore } from "@/store/auth.store";
import { ROUTES } from "@/config/routes";

export const useRole = () => {
  const user = useAuthStore((s) => s.user);

  const role = user?.role;

  const allowedRoutes =
    ROUTES[role as keyof typeof ROUTES] || [];

  const canAccess = (path: string) => {
    return allowedRoutes.includes(path);
  };

  return {
    role,
    allowedRoutes,
    canAccess,
  };
};