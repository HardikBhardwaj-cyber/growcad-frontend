"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useSendOTP } from "../hooks/useAuth";

// ✅ TYPE
type LoginFormProps = {
  onSuccess: (phone: string) => void;
};

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [phone, setPhone] = useState("");
  const { mutate, isPending } = useSendOTP();

  const handleSubmit = () => {
    mutate({phone}, {
      onSuccess: () => onSuccess(phone),
    });
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter phone number"
        value={phone}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPhone(e.target.value)
        }
      />

      <Button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Sending..." : "Send OTP"}
      </Button>
    </div>
  );
}