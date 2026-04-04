"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  // 🔐 LOGIN HANDLER
  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Invalid email or password";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-white relative overflow-hidden">

      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg-gradient.png"
          alt="bg"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* ================= LEFT PANEL ================= */}
      <div className="hidden lg:flex lg:w-[55%] items-center justify-center relative px-12">

        {/* Card */}
        <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 max-w-xl w-full">

          {/* LOGO */}
          <div className="mb-6">
            <Image
              src="/meritinfi-logo.png"
              alt="logo"
              width={140}
              height={40}
            />
          </div>

          {/* TEXT */}
          <h1 className="text-4xl font-bold leading-tight mb-4">
            The complete ERP <br />
            for coaching institutes
          </h1>

          <p className="text-white/60 mb-6">
            Manage academics, operations, and finances from one intelligent platform.
          </p>

          {/* FEATURES */}
          <div className="space-y-3 text-white/70 text-sm">
            <div>• Student & Teacher Management</div>
            <div>• Attendance & Performance Tracking</div>
            <div>• Automated Fee Collection</div>
            <div>• Insightful Analytics & Reports</div>
          </div>

          {/* FLOATING ILLUSTRATION */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="mt-10 flex justify-center"
          >
            <Image
              src="/signup-illustration.png"
              alt="dashboard"
              width={380}
              height={300}
              className="drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="flex-1 flex items-center justify-center px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[380px] p-8 rounded-2xl 
          backdrop-blur-xl bg-white/10 border border-white/20 
          shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
        >
          {/* HEADER */}
          <h2 className="text-2xl font-semibold mb-1">
            Welcome Back
          </h2>
          <p className="text-white/60 text-sm mb-6">
            Sign in to manage your institute
          </p>

          {/* ERROR */}
          {error && (
            <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm border border-red-500/20">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* EMAIL */}
            <div>
              <label className="text-xs text-white/50">EMAIL</label>
              <input
                type="email"
                placeholder="admin@growcad.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-3 bg-white/10 border border-white/20 
                rounded-xl outline-none focus:border-purple-400"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs text-white/50">PASSWORD</label>
              <div className="relative mt-1">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 
                  rounded-xl outline-none focus:border-purple-400 pr-10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* OPTIONS */}
            <div className="flex justify-between text-sm text-white/50">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-purple-500" />
                Remember me
              </label>
              <span className="cursor-pointer hover:text-white">
                Forgot password?
              </span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold
              bg-gradient-to-r from-purple-500 to-blue-500
              shadow-[0_10px_40px_rgba(124,58,237,0.5)]
              hover:scale-[1.02] transition-all duration-300
              disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* SIGNUP */}
          <p className="text-center text-white/40 text-sm mt-6">
            Don@apost have an account?{" "}
            <span
              onClick={() => router.push("/signup")}
              className="text-purple-400 cursor-pointer"
            >
              Sign Up
            </span>
          </p>

          {/* SUPPORT */}
          <button className="mt-4 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10">
            Need Help?
          </button>
        </motion.div>
      </div>
    </div>
  );
}