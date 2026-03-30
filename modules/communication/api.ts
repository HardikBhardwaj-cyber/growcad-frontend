import { api } from "@/lib/api";

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
  const res = await api.post<APIResponse>(
    "/comm/sms",
    data
  );
  return res.data;
};

// ✅ SEND WHATSAPP
export const sendWhatsApp = async (
  data: WhatsAppPayload
): Promise<APIResponse> => {
  const res = await api.post<APIResponse>(
    "/comm/whatsapp",
    data
  );
  return res.data;
};