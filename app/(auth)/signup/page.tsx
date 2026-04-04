"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Eye, EyeOff } from "lucide-react";

import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { useAuth } from "@/hooks/useAuth";

interface FormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

interface FieldProps {
  id: keyof FormState;
  label: string;
  type: "text" | "email" | "password";
  value: string;
  placeholder: string;
  autoComplete: string;
  error?: string;
  showToggle?: boolean;
  isVisible?: boolean;
  onToggle?: () => void;
  onChange: (field: keyof FormState, value: string) => void;
}

const initialForm: FormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const features = [
  "Set up admissions, fees, and attendance in one workspace.",
  "Give staff a clean system that scales with your institute.",
  "Launch with reporting and operations from day one.",
];

function BackgroundGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute left-[8%] top-[4%] h-72 w-72 rounded-full bg-purple-600/18 blur-3xl"
        animate={{ scale: [1, 1.05, 1], opacity: [0.18, 0.24, 0.18] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[10%] top-[18%] h-80 w-80 rounded-full bg-blue-500/12 blur-3xl"
        animate={{ scale: [1.03, 1, 1.03], opacity: [0.14, 0.2, 0.14] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,#070709_100%)]" />
    </div>
  );
}

function Field({
  id,
  label,
  type,
  value,
  placeholder,
  autoComplete,
  error,
  showToggle = false,
  isVisible = false,
  onToggle,
  onChange,
}: FieldProps) {
  return (
    <div className="space-y-2.5">
      <label
        htmlFor={id}
        className="block text-[11px] font-medium uppercase tracking-[0.22em] text-white/38"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={showToggle && isVisible ? "text" : type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(id, e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={[
            "w-full rounded-xl border bg-white/[0.04] px-4 py-3.5 text-sm text-white",
            "outline-none transition-all duration-200 placeholder:text-white/20",
            "focus:border-purple-400/65 focus:ring-4 focus:ring-purple-500/8",
            showToggle ? "pr-11" : "",
            error
              ? "border-red-500/35 focus:border-red-400/60 focus:ring-red-500/8"
              : "border-white/9",
          ].join(" ")}
        />

        {showToggle && onToggle ? (
          <button
            type="button"
            onClick={onToggle}
            aria-label={isVisible ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/28 transition-colors hover:text-white/60"
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-red-400"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }));
  };

  const validateForm = (values: FormState) => {
    const nextErrors: FormErrors = {};

    if (!values.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.password) {
      nextErrors.password = "Password is required.";
    } else if (values.password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }

    if (!values.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (values.password !== values.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors = validateForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      setErrors({
        form: "Signup is not connected to a backend yet. The UI and validation are ready.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070709] text-white">
      <BackgroundGlow />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12 lg:px-10">
        <div className="grid w-full gap-14 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-18">
          <Reveal variant="slideUp" className="flex flex-col justify-center">
            <div className="max-w-[520px]">
              <Link
                href="/"
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/68 transition-colors hover:border-white/16 hover:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 font-black text-white shadow-lg shadow-purple-500/20">
                  G
                </span>
                <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Growcad
                </span>
              </Link>

              <div className="mt-10">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-purple-300/72">
                  New Workspace
                </p>
                <h1 className="mt-5 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.03em] text-white sm:text-[3.4rem]">
                  Start your institute journey
                </h1>
                <p className="mt-6 max-w-[30rem] text-[15px] leading-7 text-white/46">
                  Create your Growcad workspace and bring admissions, fees, and
                  day-to-day operations into one calm system.
                </p>
              </div>

              <div className="mt-11 space-y-4">
                {features.map((feature, index) => (
                  <Reveal
                    key={feature}
                    variant="fade"
                    delay={0.06 * index}
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-purple-300/90">
                        <Check size={12} />
                      </span>
                      <p className="text-sm leading-6 text-white/56">{feature}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal variant="slideUp" delay={0.12} className="flex items-center justify-center lg:justify-end">
            <motion.div
              whileHover={{ y: -1.5 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-[460px] rounded-[28px] border border-white/10 bg-white/[0.045] shadow-[0_32px_80px_rgba(0,0,0,0.52)] backdrop-blur-2xl"
            >
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/18 to-transparent" />

              <div className="px-6 py-7 sm:px-8 sm:py-9">
                <div className="mb-9">
                  <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                    Create account
                  </div>
                  <h2 className="text-[1.75rem] font-semibold tracking-[-0.02em] text-white">
                    Build your Growcad workspace
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/40">
                    Set up your account in under a minute. Institute details can be configured after sign up.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5.5">
                  <Field
                    id="fullName"
                    label="Full Name"
                    type="text"
                    value={form.fullName}
                    placeholder="Rohit Sharma"
                    autoComplete="name"
                    error={errors.fullName}
                    onChange={updateField}
                  />

                  <Field
                    id="email"
                    label="Email"
                    type="email"
                    value={form.email}
                    placeholder="admin@growcad.in"
                    autoComplete="email"
                    error={errors.email}
                    onChange={updateField}
                  />

                  <Field
                    id="password"
                    label="Password"
                    type="password"
                    value={form.password}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    error={errors.password}
                    showToggle
                    isVisible={showPassword}
                    onToggle={() => setShowPassword((current) => !current)}
                    onChange={updateField}
                  />

                  <Field
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={form.confirmPassword}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    error={errors.confirmPassword}
                    showToggle
                    isVisible={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword((current) => !current)}
                    onChange={updateField}
                  />

                  <AnimatePresence initial={false}>
                    {errors.form ? (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white/58"
                      >
                        {errors.form}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <div className="space-y-4 pt-1">
                    <Button
                      type="submit"
                      loading={loading}
                      className="w-full justify-center py-3.5 text-sm shadow-[0_10px_24px_rgba(124,58,237,0.24)]"
                    >
                      <span className="inline-flex items-center gap-2">
                        Create Account
                        {!loading ? <ArrowRight size={15} /> : null}
                      </span>
                    </Button>

                    <p className="text-center text-xs leading-5 text-white/26">
                      By creating an account, you agree to our Terms & Conditions and Privacy Policy.
                    </p>
                  </div>
                </form>

                <p className="mt-8 text-center text-sm text-white/40">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-purple-300/90 transition-colors hover:text-purple-200"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
