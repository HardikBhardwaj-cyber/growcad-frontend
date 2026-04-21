import { get, post } from "@/lib/api";

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
  return await get<FeesResponse>("/fees");
};

// ✅ MARK PAID
export const markPaid = async (id: string) => {
  return await post(`/fees/${id}/pay`);
};