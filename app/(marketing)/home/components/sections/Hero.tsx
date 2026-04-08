'use client';

import { useRef, lazy, Suspense, useEffect, useState } from 'react';
import {
  motion, useScroll, useTransform, useSpring,
  AnimatePresence,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import MagneticButton from '../ui/MagneticButton';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import WebGLErrorBoundary from '../core/WebGLErrorBoundary';
import {
  CONTAINER, SECTION_PY, SCENES,
  HERO_PHASES, T, EASE_OUT, DUR,
} from '../../systems/design';

const BlobCanvas = lazy(() => import('../webgl/BlobCanvas'));
const Particles  = lazy(() => import('../webgl/Particles'));

// ─── Rotating headline word ────────────────────────────────────────────────────
const WORDS = ['Start growing.', 'Ship with data.', 'Kill the guesswork.', 'Outgrow your stack.'];

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % WORDS.length), 2900);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      className="relative inline-flex overflow-hidden align-bottom"
      style={{ height: '1.05em' }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          className="block bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%',   opacity: 1, transition: { duration: 0.55, ease: EASE_OUT } }}
          exit={{    y: '-100%', opacity: 0, transition: { duration: 0.28, ease: EASE_OUT } }}
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ─── Mini dashboard preview ────────────────────────────────────────────────────
const BARS = [34, 50, 40, 68, 56, 80, 64, 92, 72, 100, 84, 96];

function DashPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: HERO_PHASES.DASHBOARD, ease: EASE_OUT }}
      className="relative w-full"
    >
      {/* Outer glow */}
      <div
        className="pointer-events-none absolute -inset-8 rounded-3xl"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(109,40,217,0.12) 0%, transparent 70%)', filter: 'blur(30px)' }}
      />

      {/* Card */}
      <div
        className="relative rounded-2xl border border-white/[0.08] bg-[#0c0c10]/95 backdrop-blur-xl overflow-hidden"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.055), 0 32px 80px rgba(0,0,0,0.55)' }}
      >
        {/* Chrome bar */}
        <div className="flex items-center gap-2 border-b border-white/[0.05] bg-white/[0.015] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
          <div className="mx-auto flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-3 py-[5px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-55" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] text-white/28">app.growcad.io</span>
          </div>
        </div>

        <div className="p-5">
          {/* Revenue header */}
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/28">Monthly Revenue</p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-[22px] font-bold tracking-tight text-white">$2.4M</span>
                <span className="mb-[3px] text-[13px] font-semibold text-emerald-400">↑ 24.8%</span>
              </div>
            </div>
            {/* Sparkline */}
            <svg viewBox="0 0 100 40" className="h-8 w-24 flex-shrink-0">
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="100%" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <polyline
                points={BARS.map((v, i) => `${(i/(BARS.length-1))*100},${40-(v/100)*36}`).join(' ')}
                fill="none" stroke="url(#sg)" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Chart bars */}
          <div className="mb-5 flex items-end gap-[3px] rounded-xl bg-white/[0.02] p-3" style={{ height: 88 }}>
            {BARS.map((h, idx) => (
              <motion.div
                key={idx}
                className="flex-1 rounded-[2px]"
                style={{ background: idx >= BARS.length - 3 ? 'linear-gradient(to top, #7c3aed, #3b82f6)' : 'rgba(255,255,255,0.06)' }}
                initial={{ scaleY: 0, originY: '100%' }}
                animate={{ scaleY: 1 }}
                transition={{ delay: HERO_PHASES.DASHBOARD + 0.1 + idx * 0.035, duration: 0.4, ease: EASE_OUT }}
              />
            ))}
          </div>

          {/* Metric chips */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Active Users', val: '84.2K', delta: '+9%',   up: true  },
              { label: 'Conversion',   val: '4.7%',  delta: '+1.2%', up: true  },
              { label: 'Churn Rate',   val: '0.9%',  delta: '−0.3%', up: false },
            ].map((m) => (
              <div key={m.label} className="rounded-xl border border-white/[0.055] bg-white/[0.025] p-2.5">
                <p className="text-[9.5px] text-white/28">{m.label}</p>
                <p className="mt-[3px] text-[13px] font-bold leading-none text-white">{m.val}</p>
                <p className={`mt-1 text-[9.5px] font-semibold ${m.up ? 'text-emerald-400' : 'text-rose-400'}`}>{m.delta}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        className="absolute -top-4 -right-4 flex items-center gap-2.5 rounded-2xl border border-violet-500/22 bg-[#0d0d14]/96 px-3.5 py-2.5 backdrop-blur-xl"
        style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.55)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: HERO_PHASES.PILLS, ...T.normal }}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/18 ring-1 ring-violet-500/20">
          <svg className="h-3 w-3 text-violet-400" viewBox="0 0 16 16" fill="currentColor">
            <path d="M7.2 1.6L2 8h5.2L4.8 14.4 14 7.2H8.8L11.2 1.6z"/>
          </svg>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-white/80">Revenue spiked</p>
          <p className="text-[10px] text-white/35">+$18.4K in last hour</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Hero section ──────────────────────────────────────────────────────────────
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const rawY    = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const rawOp   = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useSpring(rawY, { damping: 30, stiffness: 100 });

  return (
    <section
      ref={sectionRef}
      data-scene={SCENES.hero}
      className={`relative flex min-h-[100svh] items-center ${SECTION_PY.hero}`}
    >
      {/* WebGL — desktop only, low opacity to not compete with content */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        transition={{ duration: DUR.EPIC, delay: 0.2, ease: EASE_OUT }}
      >
        <WebGLErrorBoundary>
          <Suspense fallback={null}>
            <BlobCanvas />
            <Particles />
          </Suspense>
        </WebGLErrorBoundary>
      </motion.div>

      {/* Ambient glows — toned down, content is primary */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div style={{ position: 'absolute', top: '10%', left: '-10%', width: 700, height: 700, background: 'radial-gradient(circle, rgba(109,40,217,0.05) 0%, transparent 65%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-10%', width: 550, height: 550, background: 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, transparent 65%)', filter: 'blur(80px)' }} />
      </div>

      {/* Content grid */}
      <motion.div
        style={{ y: contentY, opacity: rawOp }}
        className={`relative z-[10] ${CONTAINER.page} grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12`}
      >
        {/* ── LEFT: Copy ── */}
        <div className="flex flex-col max-w-[520px]">

          {/* Badge */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: HERO_PHASES.EYEBROW, ease: EASE_OUT }}
          >
            <Badge dot color="emerald">4,200+ teams replaced their data stack — this quarter</Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="mb-6 font-bold leading-[1.02] tracking-[-0.045em] text-white"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.4rem)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: HERO_PHASES.HEADLINE, ease: EASE_OUT }}
          >
            Stop guessing.
            <br />
            <RotatingWord />
          </motion.h1>

          {/* Body */}
          <motion.p
            className="mb-8 text-[1.0625rem] leading-[1.75] text-white/58"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: HERO_PHASES.BODY, ease: EASE_OUT }}
          >
            Growcad replaces your analytics, A/B testing, and revenue tools
            with one AI-powered workspace. Your whole team, finally aligned.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mb-3 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: HERO_PHASES.BODY + 0.12, ease: EASE_OUT }}
          >
            <MagneticButton variant="primary" className="!py-[13px] !px-7 animate-glow-pulse">
              Start free — no setup required <ArrowRight size={14} />
            </MagneticButton>
            <Button variant="secondary" size="md">
              <span className="mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px]">▶</span>
              Watch 2-min demo
            </Button>
          </motion.div>

          {/* Microcopy */}
          <motion.p
            className="mb-10 text-[12.5px] tracking-[0.01em] text-white/42"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: HERO_PHASES.BODY + 0.22 }}
          >
            No credit card required · Setup in 5 minutes · Cancel anytime
          </motion.p>

          {/* Social proof */}
          <motion.div
            className="flex flex-wrap items-center gap-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: HERO_PHASES.PROOF, ease: EASE_OUT }}
          >
            <div className="flex -space-x-2.5">
              {['#a78bfa','#60a5fa','#34d399','#f472b6','#fb923c'].map((c, idx) => (
                <div
                  key={idx}
                  className="h-8 w-8 rounded-full border-[2px] border-[#070709]"
                  style={{ background: `radial-gradient(circle at 35% 35%, ${c}ee, ${c}55)` }}
                />
              ))}
            </div>
            <p className="text-[13px] text-white/48">
              <span className="font-semibold text-white">2,800+</span> teams switched this quarter
            </p>
            <div className="flex items-center gap-0.5">
              {'★★★★★'.split('').map((s, idx) => (
                <span key={idx} className="text-[12px] text-amber-400/80">{s}</span>
              ))}
              <span className="ml-1 text-[12px] font-semibold text-white/75">4.9</span>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT: Dashboard preview (desktop only) ── */}
        <div className="relative hidden lg:flex lg:items-center lg:justify-end">
          <div className="w-full max-w-[420px]">
            <DashPreview />
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-[10] -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: rawOp }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: HERO_PHASES.SCROLL_CUE, duration: 0.8 }}
      >
        <span className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-white/15">Scroll</span>
        <motion.div
          className="h-6 w-px origin-top bg-gradient-to-b from-white/20 to-transparent"
          animate={{ scaleY: [0.1, 1, 0.1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
