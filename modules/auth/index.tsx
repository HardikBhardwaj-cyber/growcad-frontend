"use client";

import { useState } from "react";
import LoginForm from "./components/LoginForm";
import OTPForm from "./components/OTPForm";

export default function AuthPage() {
  const [phone, setPhone] = useState<string | null>(null);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="glass p-8 rounded-2xl w-full max-w-md">
        
        <h1 className="text-2xl font-bold mb-6 text-center gradient-text">
          Growcad Login
        </h1>

        {!phone ? (
          <LoginForm onSuccess={setPhone} />
        ) : (
          <OTPForm phone={phone} />
        )}

      </div>
    </div>
  );
}