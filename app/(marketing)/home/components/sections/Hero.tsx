'use client';

import { useRef, lazy, Suspense, useEffect, useState, useCallback } from 'react';
import {
  motion,
  useScroll, useTransform, useSpring,
  AnimatePresence, MotionValue,
} from 'framer-motion';
import { ArrowRight, Zap, BarChart3, Shield, Layers, TrendingUp, Users2 } from 'lucide-react';
import MagneticButton from '../ui/MagneticButton';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import WebGLErrorBoundary from '../core/WebGLErrorBoundary';
import {
  CONTAINER, SECTION_PY, SCENES,
  HERO_PHASES, T, EASE_OUT, DUR,
  staggerDelay, SHADOW, TYPE,
} from '../../systems/design';

// Lazy WebGL — desktop only, error-bounded
const BlobCanvas = lazy(() => import('../webgl/BlobCanvas'));
const Particles  = lazy(() => import('../webgl/Particles'));

// ─── Headline words (renders each word as an independent animated unit) ───────
const HEADLINE_LINE1 = ['The', 'growth', 'stack'];
const HEADLINE_LINE2_WORDS = ['never sleeps.', 'scales with you.', 'ships faster.', 'thinks ahead.'];

/** Animates each word in independently, staggered from HERO_PHASES.HEADLINE */
function HeadlineWord({ word, wordIdx, isGradient = false }: {
  word: string; wordIdx: number; isGradient?: boolean;
}) {
  return (
    <motion.span
      className={[
        'inline-block will-both',
        isGradient
          ? 'bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent'
          : 'text-white',
      ].join(' ')}
      initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        duration: DUR.SLOW,
        delay: HERO_PHASES.HEADLINE + wordIdx * 0.1,
        ease: EASE_OUT,
      }}
    >
      {word}
    </motion.span>
  );
}

function RotatingGradientWord({ startDelay }: { startDelay: number }) {
  const [i, setI] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const firstReveal = setTimeout(() => setStarted(true), startDelay * 1000);
    return () => clearTimeout(firstReveal);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => setI((x) => (x + 1) % HEADLINE_LINE2_WORDS.length), 2900);
    return () => clearInterval(t);
  }, [started]);

  return (
    <span
      className="relative inline-flex overflow-hidden"
      style={{ height: '1.1em', verticalAlign: 'bottom' }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          className="block bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
          initial={{ y: '110%', filter: 'blur(10px)', opacity: 0 }}
          animate={{ y: '0%',   filter: 'blur(0px)',  opacity: 1,
            transition: { duration: DUR.NORMAL, ease: EASE_OUT } }}
          exit={{   y: '-110%', filter: 'blur(10px)', opacity: 0,
            transition: { duration: DUR.FAST, ease: EASE_OUT } }}
        >
          {HEADLINE_LINE2_WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ─── Feature pills (left column beside dashboard) ─────────────────────────────
const PILLS = [
  { Icon: Zap,       label: 'AI-powered',       border: 'border-amber-500/22',   bg: 'from-amber-500/10  to-orange-500/5',  text: 'text-amber-300',   idx: 0 },
  { Icon: BarChart3, label: 'Real-time',         border: 'border-blue-500/22',    bg: 'from-blue-500/10   to-cyan-500/5',    text: 'text-blue-300',    idx: 1 },
  { Icon: Shield,    label: 'SOC 2 certified',   border: 'border-emerald-500/22', bg: 'from-emerald-500/10 to-teal-500/5',  text: 'text-emerald-300', idx: 2 },
  { Icon: Layers,    label: '500+ integrations', border: 'border-violet-500/22',  bg: 'from-violet-500/10 to-purple-500/5', text: 'text-violet-300',  idx: 3 },
];

// ─── Dashboard bar chart ──────────────────────────────────────────────────────
const BARS = [34, 50, 40, 68, 56, 80, 64, 92, 72, 100, 84, 96];

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * 100},${100 - (v / max) * 82}`
  ).join(' ');
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-8 w-24">
      <defs>
        <linearGradient id="sg-hero" x1="0" y1="0" x2="100%" y2="0">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <polyline
        points={pts} fill="none" stroke="url(#sg-hero)"
        strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Dashboard card (phase 5 — "emerges last") ────────────────────────────────
function DashCard({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  // Three depth planes with different parallax rates
  const cardY   = useTransform(scrollProgress, [0, 1], ['-22px', '22px']);
  const badgeAY = useTransform(scrollProgress, [0, 1], ['-44px', '18px']); // nearest
  const badgeBY = useTransform(scrollProgress, [0, 1], ['-6px',  '40px']); // farthest

  return (
    <div className="relative select-none">
      {/* Multi-layer glow halo — deepest, largest, most blurred */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 rounded-3xl"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(109,40,217,0.14) 0%, rgba(37,99,235,0.07) 50%, transparent 80%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Tighter glow ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 rounded-3xl"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)',
          filter: 'blur(16px)',
        }}
      />

      {/* ── Main card — Phase 5 entrance ── */}
      <motion.div
        style={{ y: cardY, boxShadow: SHADOW.dashCard, }}
        className="animate-float-bob relative overflow-hidden rounded-[22px] backdrop-blur-[18px]"
        initial={{ opacity: 0, y: 60, scale: 0.93, filter: 'blur(16px)' }}
        animate={{ opacity: 1, y:  0, scale: 1,    filter: 'blur(0px)'  }}
        transition={{
          duration: DUR.CINEMATIC,
          delay:    HERO_PHASES.DASHBOARD,
          ease:     EASE_OUT,
        }}
        
      >
        {/* Top-edge reflection */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />
        {/* Inner top-left catch-light */}
        <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-gradient-to-br from-white/[0.045] via-transparent to-transparent" />

        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-white/[0.05] bg-white/[0.015] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
          <div className="mx-auto flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-3 py-[5px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-55" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] text-white/28">app.growcad.io</span>
          </div>
        </div>

        <div className="bg-[#0c0c10]/90 p-5">
          {/* Revenue header */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/28">
                Monthly Revenue
              </p>
              <div className="mt-1 flex items-end gap-2.5">
                <span className="text-[22px] font-bold tracking-tight text-white">$2.4M</span>
                <span className="mb-[3px] text-[13px] font-semibold text-emerald-400">↑ 24.8%</span>
              </div>
            </div>
            <Sparkline data={BARS} />
          </div>

          {/* Bar chart */}
          <div
            className="mb-5 flex items-end gap-[3px] overflow-hidden rounded-xl bg-white/[0.02] p-3"
            style={{ height: 94 }}
          >
            {BARS.map((h, idx) => (
              <motion.div
                key={idx}
                className="flex-1 rounded-[2px]"
                style={{
                  background: idx >= BARS.length - 3
                    ? 'linear-gradient(to top, #7c3aed, #3b82f6)'
                    : 'rgba(255,255,255,0.06)',
                }}
                initial={{ scaleY: 0, originY: '100%' }}
                animate={{ scaleY: 1 }}
                transition={{
                  // Bars animate as part of Phase 5 (dashboard emergence)
                  delay: HERO_PHASES.DASHBOARD + 0.12 + idx * 0.038,
                  duration: DUR.FAST + (h / 100) * 0.18,
                  ease: EASE_OUT,
                }}
              />
            ))}
          </div>

          {/* Metric micro-cards */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Active Users', val: '84.2K', delta: '+9%',   up: true  },
              { label: 'Conversion',   val: '4.7%',  delta: '+1.2%', up: true  },
              { label: 'Churn Rate',   val: '0.9%',  delta: '−0.3%', up: false },
            ].map((m, idx) => (
              <motion.div
                key={m.label}
                className="rounded-[11px] border border-white/[0.055] bg-white/[0.025] p-2.5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: HERO_PHASES.DASHBOARD + 0.35 + idx * 0.08,
                  ...T.fast,
                }}
              >
                <p className="text-[9.5px] text-white/28">{m.label}</p>
                <p className="mt-[3px] text-[13px] font-bold leading-none text-white">{m.val}</p>
                <p className={`mt-1 text-[9.5px] font-semibold ${m.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {m.delta}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Floating badge A — Phase 6, nearest plane (fastest parallax) ── */}
      <motion.div
        style={{ y: badgeAY }}
        className="absolute -top-10 -right-5 z-[20]"
        initial={{ opacity: 0, y: 20, scale: 0.82, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y:  0, scale: 1.00, filter: 'blur(0px)' }}
        transition={{ delay: HERO_PHASES.PILLS, ...T.normal }}
      >
        <div
          className="flex items-center gap-2.5 rounded-2xl border border-violet-500/22 bg-[#0d0d14]/96 px-3.5 py-2.5 backdrop-blur-xl"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(139,92,246,0.08)' }}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/18 ring-1 ring-violet-500/20">
            <TrendingUp size={13} className="text-violet-400" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-white/80">Revenue spiked</p>
            <p className="text-[10px] text-white/35">+$18.4K in last hour</p>
          </div>
        </div>
      </motion.div>

      {/* ── Floating badge B — Phase 6, farthest plane (slowest parallax) ── */}
      <motion.div
        style={{ y: badgeBY }}
        className="absolute -bottom-9 -left-5 z-[20]"
        initial={{ opacity: 0, y: -20, scale: 0.82, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y:   0, scale: 1.00, filter: 'blur(0px)' }}
        transition={{ delay: HERO_PHASES.PILLS + 0.14, ...T.normal }}
      >
        <div
          className="flex items-center gap-2.5 rounded-2xl border border-blue-500/18 bg-[#0d0d14]/96 px-3.5 py-2.5 backdrop-blur-xl"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(59,130,246,0.06)' }}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/18 ring-1 ring-blue-500/20">
            <Users2 size={13} className="text-blue-400" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-white/80">New cohort activated</p>
            <p className="text-[10px] text-white/35">AI detected growth pattern</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Content exits upward — parallax at medium speed
  const rawY  = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const rawOp = useTransform(scrollYProgress, [0, 0.52], [1, 0]);
  const contentY = useSpring(rawY, { damping: 28, stiffness: 100 });

  // Pills exit faster than content (foreground plane)
  const pillsY = useTransform(scrollYProgress, [0, 1], [0, -90]);

  // Glows exit fastest — they're the furthest "back" visually but react most
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 260]);

  // WebGL background exits slowest (deep background)
  const webglY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section
      ref={sectionRef}
      data-scene={SCENES.hero}
      className={`relative flex min-h-[100svh] items-center overflow-hidden ${SECTION_PY.hero}`}
    >

      {/* ════════════════════════════════════════════════════════
          DEPTH LAYER 0: WebGL background
          Phase 0 — fades in first, before everything else.
          Blurred to push it visually behind the content plane.
          Desktop only — mobile uses CSS gradient fallback.
      ════════════════════════════════════════════════════════ */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
        style={{ y: webglY }}
        initial={{ opacity: 0, filter: 'blur(2px)' }}
        animate={{ opacity: 0.88, filter: 'blur(0.8px)' }}
        transition={{ duration: DUR.EPIC, delay: HERO_PHASES.BG, ease: EASE_OUT }}
      >
        <WebGLErrorBoundary>
          <Suspense fallback={null}>
            <BlobCanvas />
            <Particles />
          </Suspense>
        </WebGLErrorBoundary>
      </motion.div>

      {/* Mobile bg fallback (gradient instead of WebGL) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 lg:hidden"
        style={{
          background: 'radial-gradient(ellipse 120% 80% at 50% -20%, rgba(109,40,217,0.12) 0%, transparent 60%)',
        }}
      />

      {/* ════════════════════════════════════════════════════════
          DEPTH LAYER 1: Ambient glows
          Phase 1 — builds after WebGL, before content.
          Uses CSS animation-delay for guaranteed timing.
      ════════════════════════════════════════════════════════ */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ y: glowY }}
      >
        {/* Left violet glow */}
        <div
          className="animate-glow-build absolute"
          style={{
            top: '15%', left: '-18%',
            width: 820, height: 820,
            background: 'radial-gradient(circle, rgba(109,40,217,0.08) 0%, transparent 62%)',
            filter: 'blur(60px)',
            animationDelay: `${HERO_PHASES.GLOW}s`,
          }}
        />
        {/* Right blue glow */}
        <div
          className="animate-glow-build absolute"
          style={{
            top: '35%', right: '-18%',
            width: 640, height: 640,
            background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 62%)',
            filter: 'blur(60px)',
            animationDelay: `${HERO_PHASES.GLOW + 0.2}s`,
          }}
        />
        {/* Bottom center bloom */}
        <div
          className="animate-glow-build absolute"
          style={{
            bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: 1000, height: 320,
            background: 'radial-gradient(ellipse, rgba(109,40,217,0.07) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animationDelay: `${HERO_PHASES.GLOW + 0.4}s`,
          }}
        />
      </motion.div>

      {/* ════════════════════════════════════════════════════════
          DEPTH LAYER 2: Content (foreground)
          Phases 2–7 play out here in sequence.
          contentY parallax ties this to scroll position.
      ════════════════════════════════════════════════════════ */}
      <motion.div
        style={{ y: contentY, opacity: rawOp }}
        className={`relative z-[10] ${CONTAINER.page} w-full grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-10`}
      >

        {/* ── Left: Copy ── */}
        <div>

          {/* Phase 2: Badge */}
          <motion.div
            className="mb-7"
            initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
            transition={{ delay: HERO_PHASES.EYEBROW, ...T.fast }}
          >
            <Badge dot color="violet">Public beta · 4,200+ teams onboarded</Badge>
          </motion.div>

          {/* Phase 3: Headline — word-by-word reveal */}
          <h1
            className="mb-6 font-bold leading-[1.05] tracking-[-0.036em]"
            style={{ fontSize: TYPE.h1 }}
            aria-label="The growth stack — animated headline"
          >
            {/* Line 1: each word independently animated */}
            <span className="block">
              {HEADLINE_LINE1.map((word, wi) => (
                <span key={word}>
                  <HeadlineWord word={word} wordIdx={wi} />
                  {wi < HEADLINE_LINE1.length - 1 && <span>&nbsp;</span>}
                </span>
              ))}
            </span>

            {/* Line 2: rotating gradient word */}
            <RotatingGradientWord
              startDelay={HERO_PHASES.HEADLINE + HEADLINE_LINE1.length * 0.1}
            />
          </h1>

          {/* Phase 4: Body copy */}
          <motion.p
            className="mb-9 max-w-[440px] leading-[1.8] text-white/42"
            style={{ fontSize: TYPE.body }}
            initial={{ opacity: 0, y: 18, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
            transition={{ delay: HERO_PHASES.BODY, ...T.normal }}
          >
            Growcad unifies analytics, experiments, and revenue data into
            one intelligent workspace — so your team ships with conviction,
            not guesswork.
          </motion.p>

          {/* Phase 4: CTAs */}
          <motion.div
            className="mb-11 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
            transition={{ delay: HERO_PHASES.BODY + 0.1, ...T.normal }}
          >
            <MagneticButton variant="primary" className="!py-[14px] !px-8 animate-glow-pulse">
              Start for free <ArrowRight size={14} />
            </MagneticButton>
            <Button variant="secondary" size="md">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px]">
                ▶
              </span>
              Watch demo
            </Button>
          </motion.div>

          {/* Phase 7: Social proof — settles in last */}
          <motion.div
            className="flex flex-wrap items-center gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: HERO_PHASES.PROOF, duration: DUR.SLOW, ease: EASE_OUT }}
          >
            {/* Avatar stack */}
            <div className="flex -space-x-2.5">
              {['#a78bfa','#60a5fa','#34d399','#f472b6','#fb923c'].map((c, idx) => (
                <motion.div
                  key={idx}
                  className="h-8 w-8 rounded-full border-[2px] border-[#070709]"
                  style={{ background: `radial-gradient(circle at 35% 35%, ${c}ee, ${c}55)` }}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: staggerDelay(idx, HERO_PHASES.PROOF), ...T.fast }}
                />
              ))}
            </div>
            <p className="text-[13px] text-white/35">
              <span className="font-semibold text-white/62">2,800+</span> teams growing
            </p>
            {/* Stars */}
            <div className="flex items-center gap-0.5 text-[12px]">
              {'★★★★★'.split('').map((s, idx) => (
                <motion.span
                  key={idx}
                  className="text-amber-400/62"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: HERO_PHASES.PROOF + 0.1 + idx * 0.05,
                    duration: 0.3,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  {s}
                </motion.span>
              ))}
              <span className="ml-1 font-semibold text-white/55">4.9</span>
            </div>
          </motion.div>
        </div>

        {/* ── Right: Dashboard + pills (desktop only) ── */}
        <div className="relative hidden lg:flex lg:items-center lg:justify-end">
          {/* Phase 6: Pills — emerge with dashboard, faster parallax */}
          <motion.div
            style={{ y: pillsY }}
            className="absolute -left-2 top-1/2 z-[20] flex -translate-y-1/2 flex-col gap-2.5"
          >
            {PILLS.map((p) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, x: -32, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x:   0, filter: 'blur(0px)' }}
                transition={{ delay: HERO_PHASES.PILLS + p.idx * 0.12, ...T.normal }}
                className={[
                  'flex items-center gap-2 rounded-full border backdrop-blur-md',
                  `${p.border} bg-gradient-to-r ${p.bg}`,
                  'px-3.5 py-[7px]',
                ].join(' ')}
              >
                <p.Icon size={12} className={p.text} />
                <span className={`whitespace-nowrap text-[11px] font-medium ${p.text}`}>
                  {p.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Phase 5: Dashboard card */}
          <div className="ml-8 w-full max-w-[390px]">
            <DashCard scrollProgress={scrollYProgress} />
          </div>
        </div>
      </motion.div>

      {/* ════════════════════════════════════════════════════════
          Phase 8: Scroll cue — appears last, fades with scroll
      ════════════════════════════════════════════════════════ */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-[10] -translate-x-1/2 flex flex-col items-center gap-2.5"
        style={{ opacity: rawOp }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: HERO_PHASES.SCROLL_CUE, duration: 0.8 }}
      >
        <span className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-white/15">
          Scroll
        </span>
        <motion.div
          className="h-7 w-px origin-top bg-gradient-to-b from-white/22 to-transparent"
          animate={{ scaleY: [0.1, 1, 0.1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
