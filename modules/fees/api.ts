import { api } from "@/lib/api";

// ✅ TYPES
export type Fee = {
  id: string;
  name: string;
  amount: number;
  paid: boolean;
};

export type FeesResponse = {
  list: Fee[];
  total_pending: number;
};

// ✅ GET FEES
export const getFees = async (): Promise<FeesResponse> => {
  const res = await api.get<FeesResponse>("/fees");
  return res.data; // 🔥 CLEAN
};

// ✅ MARK PAID
export const markPaid = async (id: string) => {
  const res = await api.post(`/fees/${id}/pay`);
  return res.data;
};