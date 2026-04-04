"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 LOGIN HANDLER (TYPESAFE)
  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 👉 Replace with real API
      await new Promise((res) => setTimeout(res, 1200));

      router.push("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0f] text-white relative overflow-hidden">

      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg-gradient.png"
          alt="background"
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* ================= LEFT ================= */}
      <div className="hidden lg:flex lg:w-[55%] items-center justify-center relative">

        {/* Glow */}
        <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[140px] rounded-full top-10 left-10" />
        <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[140px] rounded-full bottom-10 right-10" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-xl px-12"
        >
          {/* LOGO */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="font-bold text-lg">G</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">
              GROWCAD
            </span>
          </div>

          {/* HEADLINE */}
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Run your institute <br />
            smarter & faster
          </h1>

          <p className="text-white/60 mb-8">
            Manage students, fees, attendance & analytics — all in one platform.
          </p>

          {/* FEATURES */}
          <div className="space-y-4 mb-10 text-white/70">
            <div>• Student & Teacher Management</div>
            <div>• Attendance Tracking</div>
            <div>• Automated Fee Collection</div>
            <div>• Reports & Insights</div>
          </div>

          {/* FLOATING ILLUSTRATION */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Image
              src="/dashboard-illustration.png"
              alt="dashboard"
              width={420}
              height={320}
              className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex-1 flex items-center justify-center px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[380px] p-8 rounded-2xl 
          backdrop-blur-xl bg-white/10 border border-white/20 
          shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
        >

          {/* TITLE */}
          <h2 className="text-2xl font-semibold mb-1">
            Welcome Back
          </h2>
          <p className="text-white/60 text-sm mb-6">
            Login to your dashboard
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
              <label className="text-xs text-white/50 mb-1 block">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 bg-white/10 border border-white/20 
                rounded-xl outline-none focus:border-purple-400"
                placeholder="admin@growcad.in"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs text-white/50 mb-1 block">
                PASSWORD
              </label>

              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-3 bg-white/10 border border-white/20 
                  rounded-xl outline-none focus:border-purple-400 pr-10"
                  placeholder="Enter password"
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

          {/* EXTRA */}
          <div className="flex justify-between text-sm text-white/40 mt-4">
            <span className="cursor-pointer hover:text-white">
              Forgot password?
            </span>
          </div>

          {/* FOOTER */}
          <p className="text-center text-white/40 text-sm mt-6">
            New to Growcad?{" "}
            <span
              onClick={() => router.push("/signup")}
              className="text-purple-400 cursor-pointer"
            >
              Create account
            </span>
          </p>

        </motion.div>
      </div>
    </div>
  );
}