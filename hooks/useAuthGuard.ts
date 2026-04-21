"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

export function useAuthGuard() {
  const router = useRouter();

  const isAuthenticated = useMemo(() => {
    const token = localStorage.getItem("access_token");
    return !!token;
  }, []);

  if (!isAuthenticated) {
    router.replace("/login"); // ✅ better UX
  }

  return { isAuthenticated };
}