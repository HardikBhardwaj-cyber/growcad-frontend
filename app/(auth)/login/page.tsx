"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";

// ✅ UI SYSTEM
import CursorGlow from "@/components/ui/cursor-glow";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { MotionCard } from "@/components/ui/motion-card";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔁 Redirect if logged in
  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  // 🔐 LOGIN HANDLER
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-white relative overflow-hidden">

      {/* 🔥 CURSOR GLOW */}
      <CursorGlow />

      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg-gradient.png"
          alt="bg"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Glow layers */}
        <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-purple-500/20 blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-blue-500/20 blur-[120px]" />
      </div>

      {/* ================= LEFT ================= */}
      <div className="hidden lg:flex lg:w-[55%] items-center justify-center px-12">

        <MotionCard className="p-10 max-w-xl">

          <Image
            src="/meritinfi-logo.png"
            alt="logo"
            width={140}
            height={40}
            className="mb-6"
          />

          <h1 className="text-4xl font-bold leading-tight mb-4">
            Run your institute <br /> smarter & faster
          </h1>

          <p className="text-white/60 mb-6">
            Manage students, fees, attendance & analytics — all in one platform.
          </p>

          <div className="space-y-3 text-white/70 text-sm">
            <div>• Student & Teacher Management</div>
            <div>• Attendance Tracking</div>
            <div>• Automated Fee Collection</div>
            <div>• Reports & Insights</div>
          </div>

          {/* Floating Illustration */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="mt-10 flex justify-center"
          >
            <Image
              src="/signup-illustration.png"
              alt="illustration"
              width={360}
              height={260}
              className="drop-shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
            />
          </motion.div>
        </MotionCard>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex-1 flex items-center justify-center px-6">

        <div className="relative w-full max-w-[380px]">

          {/* Glow behind */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-2xl opacity-20 rounded-2xl" />

          <MotionCard className="p-8 w-full">

            <h2 className="text-2xl font-semibold mb-1">
              Welcome Back
            </h2>
            <p className="text-white/60 text-sm mb-6">
              Login to your dashboard
            </p>

            {error && (
              <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">

              {/* EMAIL */}
              <Input
                type="email"
                placeholder="admin@growcad.in"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />

              {/* PASSWORD */}
              <div className="relative">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* BUTTON */}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-center text-white/40 text-sm mt-6">
              New to Growcad?{" "}
              <span
                onClick={() => router.push("/signup")}
                className="text-purple-400 cursor-pointer"
              >
                Create account
              </span>
            </p>

          </MotionCard>
        </div>
      </div>
    </div>
  );
}