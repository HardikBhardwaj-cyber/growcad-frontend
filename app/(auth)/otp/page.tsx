"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function OTPPage() {
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    console.log("OTP:", otp);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h2 className="text-xl font-semibold mb-4">
        Enter OTP
      </h2>

      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="p-2 border border-white/10 rounded-xl bg-white/5 mb-4"
      />

      <Button onClick={handleVerify}>
        Verify OTP
      </Button>
    </div>
  );
}