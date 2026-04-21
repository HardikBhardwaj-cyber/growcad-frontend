// modules/auth/components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Input }  from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card }   from '@/components/ui/card';
import { fadeUp, EASE_OUT } from '@/lib/motion';
import { theme }  from '@/styles/theme';
import { ROUTES } from '@/config/routes';
import { loginSchema } from '../schema';
import { useLogin } from '../hooks/useAuth';

// ─── Logo mark — shared across all auth screens ───────────────────────────────

export function AuthLogo() {
  return (
    <div className="mb-8 flex items-center gap-2.5">
      <div
        className="h-7 w-7 rounded-[9px] shadow-[0_0_14px_rgba(139,92,246,0.35)]"
        style={{ background: theme.gradients.brand }}
        aria-hidden
      />
      <span className="text-[14px] font-semibold tracking-[-0.01em] text-white">
        Growcad
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function LoginForm() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const { login, loading, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate with schema before sending to API
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errs = result.error.flatten().fieldErrors;
      setFieldErrors({
        email:    errs.email?.[0],
        password: errs.password?.[0],
      });
      return;
    }
    setFieldErrors({});
    login(email, password);
  };

  return (
    <motion.div
      className="w-full max-w-[400px]"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      <AuthLogo />

      <Card className="p-8">
        <h1 className="text-[22px] font-bold tracking-[-0.03em] text-white">
          Welcome back
        </h1>
        <p className="mt-[6px] text-[13.5px] text-white/42">
          Sign in to your institute dashboard
        </p>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4" noValidate>
          <Input
            label="Work email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@institute.com"
            icon={<Mail size={14} />}
            error={fieldErrors.email}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={<Lock size={14} />}
            error={fieldErrors.password ?? error}
          />

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded accent-violet-500"
              />
              <span className="text-[12px] text-white/36">Remember me</span>
            </label>
            <a
              href="#"
              className="text-[12px] text-violet-400 transition-colors hover:text-violet-300"
            >
              Forgot password?
            </a>
          </div>

          <Button type="submit" loading={loading} fullWidth className="mt-1">
            Sign in <ArrowRight size={14} />
          </Button>
        </form>

        <p className="mt-6 text-center text-[12px] text-white/28">
          Do not have an account?{' '}
          <Link
            href={ROUTES.signup}
            className="text-violet-400 transition-colors hover:text-violet-300"
          >
            Start free
          </Link>
        </p>
      </Card>
    </motion.div>
  );
}
