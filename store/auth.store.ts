import { create } from "zustand";

interface User {
  id: string;
  phone: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  setAuth: (user, token) =>
    set({
      user,
      token,
    }),

  logout: () => {
    localStorage.removeItem("access_token");
    set({ user: null, token: null });
    window.location.href = "/login";
  },
}));