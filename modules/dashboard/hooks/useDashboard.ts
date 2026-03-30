import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get("/dashboard");
      return res.data;
    },
  });
};