import { create } from "zustand";

interface User {
  id: string;
  phone: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;

  setAuth: (data: { user: User; token: string }) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,

  // 🔐 SET AUTH (LOGIN SUCCESS)
  setAuth: ({ user, token }) => {
    localStorage.setItem("growcad_token", token);
    localStorage.setItem("growcad_user", JSON.stringify(user));

    set({
      user,
      token,
      loading: false,
    });
  },

  // 🚪 LOGOUT
  logout: () => {
    localStorage.removeItem("growcad_token");
    localStorage.removeItem("growcad_user");

    set({
      user: null,
      token: null,
    });
  },

  // 🔄 HYDRATE (AUTO LOGIN ON REFRESH)
  hydrate: () => {
    try {
      const token = localStorage.getItem("growcad_token");
      const user = localStorage.getItem("growcad_user");

      if (token && user) {
        set({
          token,
          user: JSON.parse(user),
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error("Auth hydrate error:", error);
      set({ loading: false });
    }
  },
}));