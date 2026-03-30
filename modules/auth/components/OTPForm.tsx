"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useVerifyOTP } from "../hooks/useAuth";

// ✅ PROPS TYPE
type OTPFormProps = {
  phone: string;
};

export default function OTPForm({ phone }: OTPFormProps) {
  const [otp, setOtp] = useState("");
  const { mutate, isPending } = useVerifyOTP();

  const handleVerify = () => {
    mutate({ phone, otp });
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setOtp(e.target.value)
        }
      />

      <Button onClick={handleVerify} disabled={isPending}>
        {isPending ? "Verifying..." : "Verify OTP"}
      </Button>
    </div>
  );
}