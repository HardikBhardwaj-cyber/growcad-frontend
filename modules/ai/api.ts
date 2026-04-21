// modules/ai/api.ts

import { get, post } from "@/lib/api";

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
  return await post<GenerateResponse>("/ai/generate", { topic });
};

// ✅ PUBLISH
export const publishDoubt = async (
  data: PublishPayload
): Promise<{ success: boolean }> => {
  return await post<{ success: boolean }>("/ai/publish", data);
};

// ✅ GET DOUBTS
export const getDoubts = async (): Promise<Doubt[]> => {
  return await get<Doubt[]>("/ai/doubts");
};

// modules/ai/api.ts



export type AIChat = {
  role: "user" | "assistant";
  content: string;
};

export const aiApi = {
  chat: async (messages: AIChat[]): Promise<AIChat> => {
    return await post<AIChat>("/ai/chat", { messages });
  },

  insights: async (): Promise<{ title: string }[]> => {
    return await get<{ title: string }[]>("/ai/insights");
  },
};