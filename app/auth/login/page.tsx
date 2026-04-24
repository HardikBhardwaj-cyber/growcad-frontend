"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";

// ─── Types ────────────────────────────────────────────────────────────────────
interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suffix?: React.ReactNode;
  autoComplete?: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FloatingOrb({
  size,
  color,
  x,
  y,
  delay,
}: {
  size: number;
  color: string;
  x: string;
  y: string;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: color,
        filter: "blur(80px)",
        opacity: 0.15,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.12, 0.2, 0.12],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

function FeatureTag({ icon, text }: { icon: string; text: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -1 }}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/50 text-xs font-medium tracking-wide cursor-default select-none"
    >
      <span className="text-sm">{icon}</span>
      {text}
    </motion.div>
  );
}

function InputField({
  label,
  type,
  placeholder,
  value,
  onChange,
  suffix,
  autoComplete,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative group">
      <motion.label
        animate={{
          y: focused || hasValue ? -22 : 0,
          scale: focused || hasValue ? 0.82 : 1,
          color: focused ? "rgba(168,85,247,1)" : "rgba(255,255,255,0.4)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute left-4 top-3.5 text-sm font-medium pointer-events-none origin-left"
        style={{ transformOrigin: "left center" }}
      >
        {label}
      </motion.label>

      <input
        type={type}
        placeholder={focused ? placeholder : ""}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        className="w-full px-4 pt-5 pb-2 rounded-xl bg-white/[0.04] border text-white text-sm outline-none transition-all duration-200 placeholder:text-white/20"
        style={{
          borderColor: focused
            ? "rgba(168,85,247,0.7)"
            : "rgba(255,255,255,0.08)",
          boxShadow: focused
            ? "0 0 0 3px rgba(168,85,247,0.12), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      />
      {suffix && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{suffix}</div>
      )}
    </div>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
      <div className="text-[10px] text-white/35 uppercase tracking-widest mt-0.5">{label}</div>
    </div>
  );
}

function IllustrationCard({
  icon,
  label,
  value,
  trend,
  delay,
}: {
  icon: string;
  label: string;
  value: string;
  trend: string;
  delay: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3 + delay * 0.4, repeat: Infinity, ease: "easeInOut", delay }}
      whileHover={{ y: -12, scale: 1.04, transition: { duration: 0.25 } }}
      className="flex-1 rounded-xl p-3 cursor-default"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
      }}
      onHoverStart={(e) => {
        const el = e.target as HTMLElement;
        el.style.background = "rgba(139,92,246,0.1)";
        el.style.borderColor = "rgba(139,92,246,0.3)";
        el.style.boxShadow = "0 16px 32px rgba(124,58,237,0.2)";
      }}
      onHoverEnd={(e) => {
        const el = e.target as HTMLElement;
        el.style.background = "rgba(255,255,255,0.05)";
        el.style.borderColor = "rgba(255,255,255,0.08)";
        el.style.boxShadow = "none";
      }}
    >
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-[9px] text-white/35 uppercase tracking-widest font-semibold">{label}</div>
      <div className="text-base font-black text-white tracking-tight mt-0.5">{value}</div>
      <div className="text-[10px] text-green-400 font-semibold mt-0.5">{trend}</div>
    </motion.div>
  );
}

function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="px-3.5 py-2 rounded-2xl text-xs font-medium text-white/60 whitespace-nowrap"
            style={{
              background: "rgba(15,15,20,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
            }}
          >
            Need help? Chat with us
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 4px 16px rgba(37,211,102,0.35), 0 0 0 0 rgba(37,211,102,0.4)",
            "0 4px 16px rgba(37,211,102,0.35), 0 0 0 10px rgba(37,211,102,0)",
            "0 4px 16px rgba(37,211,102,0.35), 0 0 0 0 rgba(37,211,102,0)",
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "linear-gradient(135deg,#25d366,#128c5e)" }}
        aria-label="WhatsApp Support"
        onClick={() => window.open("https://wa.me/your-number", "_blank")}
      >
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          <path d="M16 3C8.82 3 3 8.82 3 16c0 2.41.66 4.67 1.8 6.6L3 29l6.6-1.77C11.46 28.37 13.67 29 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3z" fill="white" fillOpacity="0.95"/>
          <path d="M22.5 19.4c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.79-1.67-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.62.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.28-.19-.58-.34z" fill="#128C5E"/>
        </svg>
      </motion.button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), {
    stiffness: 150,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), {
    stiffness: 150,
    damping: 25,
  });

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#070709]">

      {/* ── Ambient Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingOrb size={600} color="radial-gradient(circle, #7c3aed, transparent)" x="10%" y="5%" delay={0} />
        <FloatingOrb size={500} color="radial-gradient(circle, #2563eb, transparent)" x="60%" y="50%" delay={2} />
        <FloatingOrb size={400} color="radial-gradient(circle, #9333ea, transparent)" x="80%" y="10%" delay={4} />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#070709_100%)]" />
      </div>

      {/* ── Main Grid ── */}
      <div className="relative z-10 w-full max-w-6xl px-6 lg:px-10 grid lg:grid-cols-[1fr_440px] gap-16 items-center">

        {/* ══════════ LEFT ══════════ */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex flex-col gap-10"
        >

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-purple-500/30">
              G
            </div>
            <span className="text-white font-semibold text-sm tracking-[0.15em] uppercase">
              Growcad
            </span>
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-[56px] font-black leading-[1.05] text-white tracking-tight">
              Run your
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-blue-400 bg-clip-text text-transparent">
                institute
              </span>
              <br />
              smarter.
            </h1>
            <p className="mt-5 text-white/45 text-base leading-relaxed max-w-sm font-light">
              One platform for student management, fees, attendance, and deep analytics.
            </p>
          </div>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: "👥", text: "Student & Teacher Management" },
              { icon: "📊", text: "Attendance Tracking" },
              { icon: "💳", text: "Automated Fee Collection" },
              { icon: "📈", text: "Reports & Insights" },
            ].map((f) => (
              <FeatureTag key={f.text} icon={f.icon} text={f.text} />
            ))}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 pt-2">
            <StatBadge value="12K+" label="Institutes" />
            <div className="w-px h-8 bg-white/10" />
            <StatBadge value="98%" label="Uptime" />
            <div className="w-px h-8 bg-white/10" />
            <StatBadge value="4.9★" label="Rating" />
          </div>

          {/* Floating Illustration Cards */}
          <div className="flex gap-3 mt-2" style={{ perspective: "600px" }}>
            {[
              { icon: "👨‍🎓", label: "Students", value: "2,847", trend: "↑ 12% this month", delay: 0 },
              { icon: "💰", label: "Fee Collected", value: "₹4.2L", trend: "↑ 8% this week", delay: 0.4 },
              { icon: "📅", label: "Attendance", value: "94.6%", trend: "↑ Today avg", delay: 0.8 },
            ].map((c) => (
              <IllustrationCard key={c.label} {...c} />
            ))}
          </div>

        </motion.div>

        {/* ══════════ RIGHT — Login Card ══════════ */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformPerspective: 1200 }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <motion.div
            whileHover={{
              boxShadow: "0 40px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(139,92,246,0.22) inset, 0 8px 32px rgba(124,58,237,0.18)",
              borderColor: "rgba(139,92,246,0.22)",
              y: -4,
            }}
            transition={{ duration: 0.35 }}
            className="relative rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow:
                "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
              backdropFilter: "blur(24px)",
            }}
          >
            {/* Top shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            <div className="px-8 py-10">

              {/* Mobile logo */}
              <div className="flex items-center gap-2 mb-8 lg:hidden">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-black text-xs">
                  G
                </div>
                <span className="text-white font-semibold text-sm tracking-widest uppercase">
                  Growcad
                </span>
              </div>

              {/* Greeting */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-purple-400" />
                  <span className="text-purple-400 text-xs font-medium tracking-widest uppercase">
                    Dashboard Access
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
                <p className="text-white/35 text-sm mt-1">Sign in to continue to your workspace</p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">

                <InputField
                  label="Email address"
                  type="email"
                  placeholder="admin@growcad.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />

                <InputField
                  label="Password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="text-white/30 hover:text-white/70 transition-colors"
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />

                {/* Options row */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                        rememberMe
                          ? "bg-purple-500 border-purple-500"
                          : "border-white/20 bg-transparent"
                      }`}
                    >
                      {rememberMe && (
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors select-none">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-xs text-purple-400/80 hover:text-purple-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -6, height: 0 }}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                      <p className="text-red-400 text-xs">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CTA */}
                <motion.button
                  type="submit"
                  disabled={loading || !email || !password}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="relative w-full mt-2 py-3.5 rounded-xl text-white text-sm font-semibold tracking-wide overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)",
                    boxShadow: "0 8px 24px rgba(124,58,237,0.35)",
                  }}
                >
                  {/* Shimmer */}
                  {!loading && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                      animate={{ translateX: ["−100%", "200%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                    />
                  )}
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                        Signing in…
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight size={15} />
                      </>
                    )}
                  </span>
                </motion.button>

              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-white/20 text-xs">or</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* SSO placeholder */}
              <button
                type="button"
                className="w-full py-3 rounded-xl border border-white/08 text-white/40 text-sm font-medium hover:border-white/15 hover:text-white/60 transition-all flex items-center justify-center gap-2"
                style={{ borderColor: "rgba(255,255,255,0.07)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Footer */}
              <p className="text-center text-xs text-white/25 mt-6">
                New to Growcad?{" "}
                <button
                  onClick={() => router.push("/signup")}
                  className="text-purple-400/80 hover:text-purple-300 transition-colors font-medium"
                >
                  Create an account
                </button>
              </p>

            </div>

            {/* Bottom shimmer line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          </motion.div>
        </motion.div>

      </div>

      {/* ── WhatsApp Help Button ── */}
      <WhatsAppButton />

      {/* ── Footer strip ── */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <p className="text-white/15 text-xs tracking-wider">
          © {new Date().getFullYear()} Growcad · Privacy · Terms
        </p>
      </div>

    </div>
  );
}
