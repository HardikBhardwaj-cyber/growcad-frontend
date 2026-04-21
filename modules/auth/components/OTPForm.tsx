// modules/auth/components/OTPForm.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card }   from '@/components/ui/card';
import { fadeUp, EASE_OUT } from '@/lib/motion';
import { theme }  from '@/styles/theme';
import { cn } from '@/lib/utils';
import { useOtpVerify } from '../hooks/useAuth';
import { authApi } from '../api';
import { AuthLogo } from './LoginForm';

// ─────────────────────────────────────────────────────────────────────────────

const LEN = 6;

interface OTPFormProps {
  phone:   string;
  onBack?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────

export function OTPForm({ phone, onBack }: OTPFormProps) {
  const [otp, setOtp]           = useState<string[]>(Array(LEN).fill(''));
  const [resending, setResend]  = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const refs                    = useRef<(HTMLInputElement | null)[]>([]);
  const { verify, loading, error } = useOtpVerify();

  // Auto-focus first box on mount
  useEffect(() => { refs.current[0]?.focus(); }, []);

  // Cooldown countdown after resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const submit = useCallback(
    (code: string) => verify(phone, code),
    [phone, verify],
  );

  // Digit input — advance focus, auto-submit when complete
  const handleChange = (v: string, i: number) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < LEN - 1) refs.current[i + 1]?.focus();
    if (v && next.every(d => d !== '')) submit(next.join(''));
  };

  // Backspace to previous box
  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  // Paste: fill all boxes from clipboard OTP
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LEN);
    if (!pasted) return;
    const next = Array(LEN).fill('');
    pasted.split('').forEach((d, i) => { next[i] = d; });
    setOtp(next);
    // Focus last filled or next empty
    const focus = Math.min(pasted.length, LEN - 1);
    refs.current[focus]?.focus();
    if (pasted.length === LEN) submit(pasted);
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResend(true);
    try {
      await authApi.sendOtp(phone);
      setCooldown(60); // 60s cooldown
      setOtp(Array(LEN).fill(''));
      refs.current[0]?.focus();
    } finally {
      setResend(false);
    }
  };

  const isComplete = otp.every(d => d !== '');

  return (
    <motion.div
      className="w-full max-w-[380px]"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      {onBack && (
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-1.5 text-[13px] text-white/36 transition-colors hover:text-white/72"
        >
          <ArrowLeft size={14} aria-hidden /> Back
        </button>
      )}

      <AuthLogo />

      <Card className="p-8">
        <h1 className="text-[22px] font-bold tracking-[-0.03em] text-white">
          Verify your number
        </h1>
        <p className="mt-[6px] text-[13.5px] text-white/42">
          6-digit code sent to{' '}
          <span className="font-medium text-white/72">{phone}</span>
        </p>

        {/* OTP inputs */}
        <div className="mt-8 flex gap-2" role="group" aria-label="One-time password">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { refs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              aria-label={`Digit ${i + 1} of ${LEN}`}
              onChange={e => handleChange(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              onPaste={i === 0 ? handlePaste : undefined}
              className={cn(
                'h-12 w-full rounded-xl border text-center text-[18px] font-bold text-white outline-none',
                'bg-white/[0.03] transition-all duration-[180ms] caret-transparent',
                digit
                  ? 'border-violet-500/55 bg-violet-500/[0.08] shadow-[0_0_0_3px_rgba(139,92,246,0.13)]'
                  : 'border-white/[0.09] focus:border-violet-500/45 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.13)]',
                error && 'border-rose-500/55 shadow-[0_0_0_3px_rgba(251,113,133,0.12)]',
              )}
            />
          ))}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="mt-3 text-center text-[12.5px] text-rose-400"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          className="mt-6"
          fullWidth
          loading={loading}
          disabled={!isComplete}
          onClick={() => submit(otp.join(''))}
          loadingText="Verifying…"
        >
          Confirm
        </Button>

        {/* Resend */}
        <p className="mt-5 text-center text-[12px] text-white/28">
          Did not receive it?{' '}
          <button
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className={cn(
              'inline-flex items-center gap-1 transition-colors',
              cooldown > 0 || resending
                ? 'cursor-not-allowed text-white/20'
                : 'text-violet-400 hover:text-violet-300',
            )}
          >
            {resending && <RefreshCw size={11} className="animate-spin" />}
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
          </button>
        </p>
      </Card>
    </motion.div>
  );
}
