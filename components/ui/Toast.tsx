// components/ui/Toast.tsx
'use client';

import {
  createContext, useCallback, useContext,
  useEffect, useRef, useState, ReactNode,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { EASE_OUT } from '@/lib/motion';
import { theme } from '@/styles/theme';
import type { LucideIcon } from "lucide-react";
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id:       string;
  variant:  ToastVariant;
  title:    string;
  message?: string;
  duration: number;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error:   (title: string, message?: string) => void;
  info:    (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Config per variant ───────────────────────────────────────────────────────

const VARIANT_CONFIG: Record<ToastVariant, {
  Icon: LucideIcon;
  iconBg:  string;
  iconCol: string;
  bar:     string;
}> = {
  success: {
    Icon:    CheckCircle2,
    iconBg:  `${theme.colors.emerald[400]}14`,
    iconCol: theme.colors.emerald[400],
    bar:     theme.colors.emerald[400],
  },
  error: {
    Icon:    AlertTriangle,
    iconBg:  `${theme.colors.rose[400]}14`,
    iconCol: theme.colors.rose[400],
    bar:     theme.colors.rose[400],
  },
  warning: {
    Icon:    AlertTriangle,
    iconBg:  `${theme.colors.amber[400]}14`,
    iconCol: theme.colors.amber[400],
    bar:     theme.colors.amber[400],
  },
  info: {
    Icon:    Info,
    iconBg:  `${theme.colors.violet[400]}14`,
    iconCol: theme.colors.violet[400],
    bar:     theme.colors.violet[400],
  },
};

// ─── Single toast item ────────────────────────────────────────────────────────

interface ToastItemProps {
  toast:     Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast: t, onDismiss }: ToastItemProps) {
  const cfg         = VARIANT_CONFIG[t.variant];
  const [w, setW]   = useState(100); // progress bar width %
  const startRef    = useRef<number | null>(null);
  const rafRef      = useRef<number | null>(null);

  // Progress bar drains over toast.duration
  useEffect(() => {
    const animate = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed  = now - startRef.current;
      const remaining = Math.max(0, 100 - (elapsed / t.duration) * 100);
      setW(remaining);
      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        onDismiss(t.id);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [t.id, t.duration, onDismiss]);

  return (
    <motion.div
      layout
      // Entry: slides in from right + fades. Exit: slides right + fades out.
      initial={{ opacity: 0, x: 48,  scale: 0.96, filter: 'blur(4px)' }}
      animate={{ opacity: 1, x: 0,   scale: 1,    filter: 'blur(0px)'  }}
      exit={{   opacity: 0, x: 48,  scale: 0.96, filter: 'blur(4px)'  }}
      transition={{ duration: theme.duration.standard, ease: EASE_OUT }}
      className="relative w-full max-w-[340px] overflow-hidden rounded-2xl"
      style={{
        background: theme.colors.bgFloat,
        border:     `1px solid ${theme.colors.borderMid}`,
        boxShadow:  theme.shadows.dashCard,
        zIndex:     theme.zIndex.float + 5,
      }}
      role="alert"
      aria-live="polite"
    >
      {/* Top-edge light — matches Card pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        }}
      />

      {/* Accent bar — left edge colour-coded by variant */}
      <div
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ background: cfg.bar }}
      />

      {/* Content */}
      <div className="flex items-start gap-3 px-4 py-3.5 pl-5">
        {/* Icon */}
        <div
          className="mt-[1px] flex h-7 w-7 shrink-0 items-center justify-center rounded-xl"
          style={{ background: cfg.iconBg, color: cfg.iconCol }}
          aria-hidden
        >
          <cfg.Icon size={14} />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-white/90">{t.title}</p>
          {t.message && (
            <p className="mt-0.5 text-[12px] leading-[1.5] text-white/42">{t.message}</p>
          )}
        </div>

        {/* Dismiss */}
        <button
          onClick={() => onDismiss(t.id)}
          className="shrink-0 rounded-lg p-1 text-white/24 transition-colors hover:bg-white/[0.06] hover:text-white/60"
          aria-label="Dismiss notification"
        >
          <X size={13} />
        </button>
      </div>

      {/* Progress bar — drains left to right over duration */}
      <div
        aria-hidden
        className="h-[2px] transition-none"
        style={{
          width:      `${w}%`,
          background: cfg.bar,
          opacity:    0.4,
        }}
      />
    </motion.div>
  );
}

// ─── Provider ────────────────────────────────────────────────────────────────

interface ToastProviderProps { children: ReactNode; }

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(ts => ts.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(ts => [...ts, { ...opts, id }]);
  }, []);

  const success = useCallback(
    (title: string, msg?: string) =>
      toast({ variant: 'success', title, message: msg, duration: 4000 }),
    [toast],
  );
  const error = useCallback(
    (title: string, msg?: string) =>
      toast({ variant: 'error', title, message: msg, duration: 5000 }),
    [toast],
  );
  const info = useCallback(
    (title: string, msg?: string) =>
      toast({ variant: 'info', title, message: msg, duration: 4000 }),
    [toast],
  );
  const warning = useCallback(
    (title: string, msg?: string) =>
      toast({ variant: 'warning', title, message: msg, duration: 4500 }),
    [toast],
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}

      {/* Toast stack — bottom-right, above all content */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-6 right-6 flex flex-col gap-2.5"
        style={{ zIndex: theme.zIndex.float + 5 }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {toasts.map(t => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
