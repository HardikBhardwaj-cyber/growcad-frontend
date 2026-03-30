"use client";

import Button from "@/components/ui/Button";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass p-8 rounded-2xl w-full max-w-sm">
        
        <h2 className="text-xl font-bold mb-4">
          Create Account
        </h2>

        <Button variant="gradient">
          Continue with Google
        </Button>
      </div>
    </div>
  );
}