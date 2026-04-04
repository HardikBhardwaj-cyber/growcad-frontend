import { useAuthStore } from "@/store/auth.store";
import API from "@/services/api";
import { AxiosError } from "axios";

interface LoginResponse {
  user: {
    id: string;
    phone: string;
    role: string;
  };
  token: string;
}

export const useAuth = () => {
  const { user, token, setAuth, logout, loading } = useAuthStore();

  const login = async (email: string, password: string) => {
    try {
      const res = await API.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const { user, token } = res.data;

      setAuth({ user, token });

      return res.data;
    } catch (err: unknown) {
      // ✅ Proper Axios error handling
      if (err instanceof AxiosError) {
        const message =
          err.response?.data?.message ||
          "Invalid email or password";

        throw new Error(message);
      }

      // fallback
      throw new Error("Something went wrong");
    }
  };

  return {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  };
};