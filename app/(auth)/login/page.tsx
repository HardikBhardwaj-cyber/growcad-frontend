"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";

// UI SYSTEM
import CursorGlow from "@/components/ui/cursor-glow";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { MotionCard } from "@/components/ui/motion-card";
import Reveal from "@/components/ui/Reveal";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Redirect if logged in
  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  // ✅ Login handler
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0f] overflow-hidden">
      
      {/* 🔥 Cursor Glow */}
      <CursorGlow />

      {/* 🔥 Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg-gradient.png"
          alt="bg"
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* ================== MAIN CONTAINER ================== */}
      <div className="w-full max-w-7xl px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">

        {/* ================== LEFT PANEL ================== */}
        <Reveal>
          <div className="relative">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 lg:p-12 shadow-xl">
              
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center font-bold">
                  G
                </div>
                <span className="text-lg font-semibold tracking-wide">
                  GROWCAD
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Run your institute <br />
                smarter & faster
              </h1>

              {/* Subtext */}
              <p className="text-white/70 mb-6">
                Manage students, fees, attendance & analytics — all in one platform.
              </p>

              {/* Features */}
              <ul className="space-y-3 text-white/60 text-sm">
                <li>• Student & Teacher Management</li>
                <li>• Attendance Tracking</li>
                <li>• Automated Fee Collection</li>
                <li>• Reports & Insights</li>
              </ul>

              {/* Illustration */}
              <div className="mt-10 relative h-[260px]">
                <Image
                  src="/signup-illustration.png"
                  alt="illustration"
                  fill
                  className="object-contain"
                />
              </div>

            </div>
          </div>
        </Reveal>

        {/* ================== RIGHT PANEL ================== */}
        <Reveal delay={0.2}>
          <div className="flex justify-center lg:justify-end">

            <MotionCard className="w-full max-w-md">

              <form onSubmit={handleLogin} className="space-y-5">

                {/* Heading */}
                <div>
                  <h2 className="text-2xl font-semibold">Welcome Back</h2>
                  <p className="text-sm text-white/60">
                    Login to your dashboard
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs text-white/60">Email</label>
                  <Input
                    type="email"
                    placeholder="admin@growcad.in"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                  />
                </div>

                {/* Password */}
                <div className="space-y-1 relative">
                  <label className="text-xs text-white/60">Password</label>

                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-[34px] text-white/40 hover:text-white"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                {/* Button */}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                {/* Footer */}
                <p className="text-xs text-center text-white/50">
                  New to Growcad?{" "}
                  <span
                    className="text-purple-400 cursor-pointer"
                    onClick={() => router.push("/signup")}
                  >
                    Create account
                  </span>
                </p>

              </form>

            </MotionCard>

          </div>
        </Reveal>

      </div>
    </div>
  );
}