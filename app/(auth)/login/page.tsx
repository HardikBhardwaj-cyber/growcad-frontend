"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";

import { useAuth } from "@/hooks/useAuth";

/* ================= TYPES ================= */

type InputFieldProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suffix?: React.ReactNode;
};

/* ================= PAGE ================= */

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPw, setShowPw] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const cardRef = useRef<HTMLDivElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [4, -4]),
    { stiffness: 150, damping: 25 }
  );

  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-4, 4]),
    { stiffness: 150, damping: 25 }
  );

  // ✅ Redirect if logged in
  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  // ✅ Mouse tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // ✅ Login
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
    <div className="relative min-h-screen flex items-center justify-center bg-[#070709] overflow-hidden">

      {/* 🔥 BACKGROUND LIGHT */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[120px] top-[-100px] left-[-100px]" />
        <div className="absolute w-[400px] h-[400px] bg-blue-600/20 blur-[120px] bottom-[-100px] right-[-100px]" />
      </div>

      {/* ================= GRID ================= */}
      <div className="w-full max-w-7xl px-6 lg:px-12 grid lg:grid-cols-[1fr_420px] gap-20 items-center">

        {/* ================= LEFT ================= */}
        <div className="hidden lg:flex flex-col gap-10">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold">
              G
            </div>
            <span className="text-white font-semibold">GROWCAD</span>
          </div>

          <div>
            <h1 className="text-[52px] font-semibold leading-tight text-white">
              Run your institute <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                smarter & faster
              </span>
            </h1>

            <p className="mt-4 text-white/60 max-w-md">
              Manage students, fees, attendance and analytics — all in one platform.
            </p>
          </div>

          <div className="relative w-[420px] h-[280px]">
            <Image
              src="/signup-illustration.png"
              alt="illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformPerspective: 1000 }}
          className="relative"
        >
          {/* 🔥 SPOTLIGHT EFFECT */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 hover:opacity-100 transition"
            style={{
              background:
                "radial-gradient(600px circle at var(--x) var(--y), rgba(168,85,247,0.15), transparent 40%)",
            }}
          />

          {/* CARD */}
          <div className="relative rounded-2xl p-8 backdrop-blur-xl border border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.6)] w-full max-w-md mx-auto">

            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white">
                Welcome back
              </h2>
              <p className="text-white/50 text-sm">
                Login to your dashboard
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-4">

              <InputField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <InputField
                label="Password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              {/* 🔥 MAGNETIC BUTTON */}
              <MagneticButton loading={loading} />

            </form>

            <p className="text-xs text-center text-white/40 mt-6">
              New to Growcad?{" "}
              <span
                className="text-purple-400 cursor-pointer"
                onClick={() => router.push("/signup")}
              >
                Create account
              </span>
            </p>

          </div>
        </motion.div>

      </div>
    </div>
  );
}

/* ================= INPUT ================= */

function InputField({
  label,
  value,
  onChange,
  type = "text",
  suffix,
}: InputFieldProps) {
  const [focus, setFocus] = useState<boolean>(false);

  return (
    <div className="relative">
      <label
        className={`absolute left-3 text-xs transition-all ${
          focus || value
            ? "top-1 text-purple-400"
            : "top-3 text-white/40"
        }`}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className="w-full h-12 px-3 pt-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500"
      />

      {suffix && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {suffix}
        </div>
      )}
    </div>
  );
}

/* ================= MAGNETIC BUTTON ================= */

function MagneticButton({ loading }: { loading: boolean }) {
  const ref = useRef<HTMLButtonElement | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    ref.current!.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  return (
    <button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      type="submit"
      disabled={loading}
      className="w-full py-3 rounded-xl text-white font-medium bg-gradient-to-r from-purple-600 to-blue-500 transition-all"
    >
      {loading ? "Signing in..." : "Sign In"}
    </button>
  );
}