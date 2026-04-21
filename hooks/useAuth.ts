"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import API from "@/services/api";
import { AxiosError } from "axios";
import { USER_ROLES } from "@/types/auth";
import type { AuthUser, UserRole } from "@/types/auth";

// ─── API RESPONSE TYPE ───────────────────────────────────────────────────────

interface LoginResponse {
  user: {
    id: string;
    phone: string;
    role: string;

    // optional from backend
    name?: string;
    email?: string;
    tenantId?: string;
  };
  token: string;
}

// ─── ROLE VALIDATION ─────────────────────────────────────────────────────────



const isValidRole = (role: string): role is UserRole => {
  return USER_ROLES.includes(role as UserRole);
};

// ─── HOOK ────────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const { user, token, setUser, setToken, logout } = useAuthStore();

  const [loading, setLoading] = useState(false);

  // ─── LOGIN ────────────────────────────────────────────────────────────────

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      const res = await API.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const { user, token } = res.data;

      // ✅ ROLE FIX (STRICT TYPE)
      const role: UserRole = isValidRole(user.role)
        ? user.role
        : "student";

      // ✅ DTO → DOMAIN MAPPING
      const authUser: AuthUser = {
        id: user.id,
        phone: user.phone,
        role,
        name: user.name ?? "",
        email: user.email ?? "",
        tenantId: user.tenantId ?? "",
      };

      // ✅ STORE UPDATE
      setUser(authUser);
      setToken(token);

      return res.data;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        throw new Error(
          err.response?.data?.message || "Invalid email or password"
        );
      }

      throw new Error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ─── RETURN ───────────────────────────────────────────────────────────────

  return {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  };
};