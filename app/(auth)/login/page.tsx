"use client";

import { useState } from "react";
import { sendOTP, verifyOTP } from "@/modules/auth/api";
import { useAuthStore } from "@/store/auth.store";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      await sendOTP(phone);
      setStep(2);
    } catch {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);

      const res = await verifyOTP(phone, otp);

      localStorage.setItem("access_token", res.token);
      setAuth(res.user, res.token);

      window.location.href = "/onboarding";
    } catch {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass p-8 rounded-2xl w-full max-w-sm">

        <h2 className="text-xl font-bold mb-4">Login</h2>

        {step === 1 && (
          <>
            <input
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl bg-transparent border mb-4"
            />

            <Button loading={loading} onClick={handleSendOTP}>
              Send OTP
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 rounded-xl bg-transparent border mb-4"
            />

            <Button loading={loading} onClick={handleVerify}>
              Verify OTP
            </Button>
          </>
        )}
      </div>
    </div>
  );
}