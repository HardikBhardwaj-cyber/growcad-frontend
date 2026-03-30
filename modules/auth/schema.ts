import { z } from "zod";

export const phoneSchema = z.object({
  phone: z.string().min(10, "Invalid phone number"),
});

export const otpSchema = z.object({
  otp: z.string().min(4, "Invalid OTP"),
});