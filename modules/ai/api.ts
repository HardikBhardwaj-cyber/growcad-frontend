import { api } from "@/lib/api";

// ✅ TYPES
type GenerateResponse = {
  doubt: string;
};

type PublishPayload = {
  title: string;
  content: string;
};

type Doubt = {
  id: string;
  topic: string;
  answer: string;
};

// ✅ GENERATE
export const generateDoubt = async (
  topic: string
): Promise<GenerateResponse> => {
  const res = await api.post<GenerateResponse>(
    "/ai/generate",
    { topic }
  );
  return res.data;
};

// ✅ PUBLISH
export const publishDoubt = async (
  data: PublishPayload
): Promise<{ success: boolean }> => {
  const res = await api.post<{ success: boolean }>(
    "/ai/publish",
    data
  );
  return res.data;
};

// ✅ GET DOUBTS
export const getDoubts = async (): Promise<Doubt[]> => {
  const res = await api.get<Doubt[]>("/ai/doubts");
  return res.data;
};