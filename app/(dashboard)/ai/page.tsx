// app/(dashboard)/ai/page.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Send, Sparkles, Bot, User, Zap, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/shared/PageWrapper';
import { Card }        from '@/components/ui/card';
import { Button }      from '@/components/ui/Button';
import { Skeleton }    from '@/components/ui/skeleton';
import { EmptyState }  from '@/components/shared/State';
import { aiApi, type AIChat } from '@/modules/ai/api';
import { useGeminiFlash } from '@/modules/billing/hooks/useAI';
import { useGeminiQuota } from '@/modules/billing/hooks/useBilling';
import { useFeatureGate } from '@/modules/billing/hooks/useFeatureGate';
import { FEATURE }     from '@/modules/billing/types';
import { fadeUp, staggerContainer, EASE_OUT } from '@/lib/motion';
import { theme }       from '@/styles/theme';
import { cn }          from '@/lib/utils';
import Link            from 'next/link';
import { ROUTES }      from '@/config/routes';

// ─── Quota banner ─────────────────────────────────────────────────────────────
// Shown at the top of the AI page so teachers always know their remaining budget.

function QuotaBanner() {
  const { quota, isLoading } = useGeminiQuota();
  const { allowed }          = useFeatureGate(FEATURE.AI_GEMINI_FLASH);

  if (!allowed) return null;

  if (isLoading) {
    return (
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="ml-auto h-3 w-16" />
      </div>
    );
  }

  if (!quota) return null;

  const { used, limit, resetAt } = quota;
  const remaining = limit - used;
  const pct       = Math.min(100, Math.round((used / limit) * 100));
  const isLow     = remaining <= Math.ceil(limit * 0.2); // below 20% remaining
  const isDepleted = remaining <= 0;

  const resetTime = new Date(resetAt).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible"
      className="mb-4 flex flex-col gap-2 rounded-xl border px-4 py-3"
      style={{
        background: isDepleted
          ? `${theme.colors.rose[400]}0a`
          : isLow
          ? `${theme.colors.amber[400]}0a`
          : 'rgba(255,255,255,0.025)',
        border: isDepleted
          ? `1px solid ${theme.colors.rose[400]}22`
          : isLow
          ? `1px solid ${theme.colors.amber[400]}22`
          : `1px solid rgba(255,255,255,0.07)`,
      }}>
      <div className="flex items-center gap-2.5">
        {/* Icon */}
        <Sparkles
          size={14}
          className={isDepleted ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-violet-400'}
          aria-hidden
        />

        {/* Copy */}
        <div className="flex-1">
          {isDepleted ? (
            <p className="text-[13px] font-semibold text-rose-400">
              Your daily AI quota is used up.{' '}
              <span className="font-normal text-white/50">
                Resets at {resetTime}.
              </span>
            </p>
          ) : isLow ? (
            <p className="text-[13px] font-semibold text-amber-400">
              {remaining} AI quer{remaining === 1 ? 'y' : 'ies'} left today.{' '}
              <span className="font-normal text-white/50">
                Resets at {resetTime}.
              </span>
            </p>
          ) : (
            <p className="text-[13px] text-white/60">
              <span className="font-semibold text-white/80">{remaining}</span> of{' '}
              <span className="font-semibold text-white/80">{limit}</span> AI queries remaining today
            </p>
          )}
        </div>

        {/* Pct */}
        <span className={cn(
          'shrink-0 text-[12px] font-bold tabular-nums',
          isDepleted ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-white/36',
        )}>
          {pct}% used
        </span>
      </div>

      {/* Mini bar */}
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: isDepleted
              ? `${theme.colors.rose[400]}`
              : isLow
              ? theme.colors.amber[400]
              : theme.gradients.brand,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        />
      </div>

      {isDepleted && (
        <p className="text-[11.5px] text-white/36">
          Your daily limit is calculated as: (active students ÷ 2).{' '}
          <Link href={ROUTES.billing as string} className="text-violet-400 hover:text-violet-300 transition-colors">
            Learn more →
          </Link>
        </p>
      )}
    </motion.div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/20 border border-violet-500/20">
        <Bot size={13} className="text-violet-400" aria-hidden />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl border border-white/[0.07] bg-white/[0.04] px-4 py-3">
        {[0, 0.15, 0.3].map(d => (
          <motion.div
            key={d}
            className="h-1.5 w-1.5 rounded-full bg-violet-400"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 0.9, delay: d, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Chat page ────────────────────────────────────────────────────────────────

const STARTER_PROMPTS = [
  'Which students have pending fees this month?',
  'Summarise attendance for last week',
  'Generate a fee reminder message',
  'Show me top performers in the batch',
];

export default function AIPage() {
  const [input,    setInput]    = useState('');
  const [messages, setMessages] = useState<AIChat[]>([
    {
      role:    'assistant',
      content: 'Hello! I\'m your Growcad AI. Ask me anything about your students, fees, or attendance — I\'ll pull the data and give you a clear answer.',
    },
  ]);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);

  const { data: insights = [] } = useQuery({
    queryKey: ['ai', 'insights'],
    queryFn:  aiApi.insights,
  });

  const { mutate: chat, isPending } = useMutation({
    mutationFn: (msgs: AIChat[]) => aiApi.chat(msgs),
    onSuccess:  (reply) => setMessages(m => [...m, reply]),
  });

  const send = useCallback((text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isPending) return;
    const userMsg: AIChat = { role: 'user', content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    chat(next);
  }, [input, isPending, messages, chat]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  const prompts = insights.length > 0
    ? insights.map(i => i.title)
    : STARTER_PROMPTS;

  return (
    <PageWrapper className="flex h-full flex-col pb-0">
      {/* Header */}
      <motion.div
        className="mb-4 flex items-center gap-2.5"
        variants={fadeUp} initial="hidden" animate="visible"
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{
            background: `${theme.colors.violet[500]}18`,
            border:     `1px solid ${theme.colors.violet[500]}28`,
          }}
          aria-hidden
        >
          <Sparkles size={16} className="text-violet-400" />
        </div>
        <div>
          <h1 className="text-[18px] font-bold tracking-[-0.03em] text-white">AI Assistant</h1>
          <p className="text-[12px] text-white/36">Ask anything about your institute</p>
        </div>
      </motion.div>

      {/* Quota banner — teacher sees their remaining queries */}
      <QuotaBanner />

      {/* Starter prompts — disappear after first message */}
      <AnimatePresence>
        {messages.length <= 1 && (
          <motion.div
            className="mb-4"
            initial="hidden" animate="visible" exit={{ opacity: 0, height: 0 }}
            variants={staggerContainer(0.05, 0.04)}
          >
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white/28">
              Try asking
            </p>
            <div className="flex flex-wrap gap-2">
              {prompts.map((p, i) => (
                <motion.button
                  key={i}
                  variants={fadeUp}
                  onClick={() => send(p)}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-[12.5px] text-white/50 transition-all hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white/80"
                >
                  {p}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-white/[0.07] bg-white/[0.026] p-4 mb-4">
        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                className={cn('flex gap-3', m.role === 'user' && 'justify-end')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0  }}
                transition={{ duration: 0.24, ease: EASE_OUT }}
              >
                {m.role === 'assistant' && (
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border"
                    style={{
                      background: `${theme.colors.violet[500]}20`,
                      borderColor:`${theme.colors.violet[500]}25`,
                    }}
                    aria-hidden
                  >
                    <Bot size={13} className="text-violet-400" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3 text-[13.5px] leading-[1.65]',
                    m.role === 'assistant'
                      ? 'border border-white/[0.07] bg-white/[0.04] text-white/80'
                      : 'text-white',
                  )}
                  style={m.role === 'user' ? { background: theme.colors.violet[600] } : {}}
                >
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                    style={{ background: `${theme.colors.violet[500]}20` }}
                    aria-hidden
                  >
                    <User size={13} className="text-violet-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isPending && <TypingDots />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.03] px-4 py-3 transition-colors focus-within:border-violet-500/45">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask about fees, attendance, student performance…"
          className="flex-1 bg-transparent text-[13.5px] text-white placeholder:text-white/22 outline-none"
          aria-label="Message to AI assistant"
        />
        <motion.button
          onClick={() => send()}
          disabled={!input.trim() || isPending}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white transition-colors disabled:opacity-40"
          style={{ background: theme.colors.violet[600] }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ background: theme.colors.violet[500] }}
          transition={{ duration: 0.15 }}
          aria-label="Send message"
        >
          <Send size={13} aria-hidden />
        </motion.button>
      </div>
    </PageWrapper>
  );
}
