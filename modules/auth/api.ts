import { api } from "@/lib/api";

type VerifyOTPResponse = {
  token: string;
  user: {
    id: string;
    phone: string;
    role: "admin" | "teacher" | "student";
  };
};

export const sendOTP = (phone: string) =>
  api.post("/auth/send-otp", { phone });



export const verifyOTP = async (
  phone: string,
  otp: string
): Promise<VerifyOTPResponse> => {
  const res = await api.post<VerifyOTPResponse>(
    "/auth/verify-otp",
    { phone, otp }
  );

  return res.data; // ✅ IMPORTANT
};

export const googleLogin = (token: string) =>
  api.post("/auth/google", { token });