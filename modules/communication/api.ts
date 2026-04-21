import { post } from "@/lib/api";

// ✅ TYPES

type SMSPayload = {
  phone: string;
  message: string;
};

type WhatsAppPayload = {
  phone: string;
  message: string;
};

type APIResponse = {
  success: boolean;
  message?: string;
};

// ✅ SEND SMS
export const sendSMS = async (
  data: SMSPayload
): Promise<APIResponse> => {
  return await post<APIResponse>("/comm/sms", data);
};

// ✅ SEND WHATSAPP
export const sendWhatsApp = async (
  data: WhatsAppPayload
): Promise<APIResponse> => {
  return await post<APIResponse>("/comm/whatsapp", data);
};