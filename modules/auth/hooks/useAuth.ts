import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ✅ TYPES
type SendOTPInput = {
  phone: string;
};

type VerifyOTPInput = {
  phone: string;
  otp: string;
};

type VerifyOTPResponse = {
  access_token: string;
  user: {
    id: string;
    phone: string;
  };
};

// ========================================
// 🔥 API FUNCTIONS
// ========================================

// SEND OTP
const sendOTP = async (data: SendOTPInput) => {
  const res = await api.post("/auth/send-otp", data);
  return res.data;
};

// VERIFY OTP
const verifyOTP = async (
  data: VerifyOTPInput
): Promise<VerifyOTPResponse> => {
  const res = await api.post<VerifyOTPResponse>(
    "/auth/verify-otp",
    data
  );
  return res.data;
};

// ========================================
// 🔥 HOOKS (THIS WAS MISSING)
// ========================================

// ✅ SEND OTP HOOK
export const useSendOTP = () => {
  return useMutation({
    mutationFn: sendOTP,
  });
};

// ✅ VERIFY OTP HOOK
export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: verifyOTP,

    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/dashboard";
    },
  });
};