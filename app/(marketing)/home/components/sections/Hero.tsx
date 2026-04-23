'use client';

import { useRef, lazy, Suspense, useEffect, useState } from 'react';
import {
  motion, useScroll, useTransform, useSpring,
  AnimatePresence, useMotionValue, useInView,
} from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import MagneticButton         from '../ui/MagneticButton';
import Button                 from '../ui/Button';
import Badge                  from '../ui/Badge';
import WebGLErrorBoundary     from '../core/WebGLErrorBoundary';
import { useCountUp, EASINGS }from '../../hooks/useCountUp';
import {
  HERO_INNER, SCENES, T, EASE_OUT,
} from '../../systems/design';
import {
  EASE, DUR, HERO_PHASES, SPRING,
  fadeIn, loadAnimeTimeline,
} from '@/lib/motionSystem';
import { useAppNavigation } from '@/hooks/useAppNavigation';

const BlobCanvas = lazy(() => import('../webgl/BlobCanvas'));
const Particles  = lazy(() => import('../webgl/Particles'));

// ─── Timing constants (linear cascade, no element animates at same moment) ───
// Each step waits for the previous to reach ~70% complete before starting.
// badge(0.10) → headline(0.30) → subtext(0.50) → cta(0.66) → proof(0.80)
// dashboard starts at 0.50 — enters alongside subtext so left+right feel parallel
const PHASE = {
  BADGE:      0.10,
  HEADLINE:   0.30,
  SUBTEXT:    0.50,
  CTA:        0.66,
  MICROCOPY:  0.72,
  PROOF:      0.80,
  DASHBOARD:  0.50,
  PILLS:      0.90,
  SCROLL_CUE: 2.00,
} as const;

// ─── Data stats (real-looking, consistent with social proof copy) ─────────────
const STATS = [
  { label: 'Institutes',  target: 4200,  prefix: '',   suffix: '+',  decimals: 0 },
  { label: 'Revenue',     target: 42,    prefix: '₹',  suffix: 'Cr', decimals: 0 },
  { label: 'Attendance',  target: 94.6,  prefix: '',   suffix: '%',  decimals: 1 },
] as const;

// ─── Rotating headline word ───────────────────────────────────────────────────
const WORDS = [
  'Admissions Done.',
  'Fees Collected.',
  'Students Tracked.',
  'Growth Automated.',
];

function RotatingWord() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI(x => (x + 1) % WORDS.length), 2900);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="relative inline-flex overflow-hidden align-bottom"
      style={{ height: '1.05em' }}
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          className="block bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%',   opacity: 1,
            transition: { duration: DUR.SLOW, ease: EASE.out } }}
          exit={{    y: '-100%', opacity: 0,
            transition: { duration: DUR.FAST, ease: EASE.in  } }}
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ─── Animated stat block ──────────────────────────────────────────────────────
function StatBlock({
  label, target, prefix, suffix, decimals, delay,
}: {
  label: string; target: number; prefix: string;
  suffix: string; decimals: number; delay: number;
}) {
  const ref  = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: '-60px' });
  const num  = useCountUp(target, seen, {
    duration:  2.0,
    decimals,
    easing:    EASINGS.easeOutExpo,
    separator: ',',
  });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col"
      initial={{ opacity: 0, y: 10 }}
      animate={seen ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: DUR.NORMAL, delay, ease: EASE.out }}
    >
      <span
        className="font-bold tracking-tight text-white tabular-nums"
        style={{ fontSize: 'clamp(1.25rem, 1.8vw, 1.6rem)' }}
        aria-label={`${target}${suffix} ${label}`}
      >
        {prefix}{num}{suffix}
      </span>
      <span className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">
        {label}
      </span>
    </motion.div>
  );
}

// ─── Trust strip (above CTA) ─────────────────────────────────────────────────
function TrustStrip({ delay }: { delay: number }) {
  return (
    <motion.div
      className="flex flex-wrap items-center gap-x-5 gap-y-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.NORMAL, delay, ease: EASE.soft }}
    >
      {/* Rating */}
      <div className="flex items-center gap-1.5" aria-label="Rated 4.9 out of 5">
        <div className="flex items-center gap-0.5" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star key={idx} size={11} className="fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="text-[12px] font-semibold text-white/75">4.9</span>
        <span className="text-[11.5px] text-white/35">· 1,200+ reviews</span>
      </div>

      {/* Separator */}
      <span className="h-3 w-px bg-white/12" aria-hidden="true" />

      {/* Social proof */}
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1.5" aria-hidden="true">
          {['#a78bfa', '#60a5fa', '#34d399', '#f472b6', '#fb923c'].map((c, idx) => (
            <div
              key={idx}
              className="h-6 w-6 rounded-full border-[1.5px] border-[#070709]"
              style={{ background: `radial-gradient(circle at 35% 35%, ${c}ee, ${c}55)` }}
            />
          ))}
        </div>
        <p className="text-[12px] text-white/50">
          <span className="font-semibold text-white/80">300+</span> joined this month
        </p>
      </div>
    </motion.div>
  );
}

// ─── Dashboard preview ────────────────────────────────────────────────────────
const BARS = [34, 50, 40, 68, 56, 80, 64, 92, 72, 100, 84, 96];

function DashPreview() {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { damping: 28, stiffness: 220 });
  const sRotY = useSpring(rotY, { damping: 28, stiffness: 220 });

  // Gentle float — pauses when tab is hidden to save GPU/battery
  const floatY   = useMotionValue(0);
  const rafRef   = useRef<number>(0);
  const startRef = useRef<number>(0);
  const hiddenRef= useRef<number>(0); // accumulated hidden time

  useEffect(() => {
    startRef.current  = performance.now();
    hiddenRef.current = 0;

    // Defined inside useEffect so it can recurse without useCallback.
    // floatY, rafRef, startRef, hiddenRef are all stable for component lifetime.
    function runFloat(now: number) {
      const elapsed = (now - startRef.current - hiddenRef.current) / 1000;
      floatY.set(Math.sin(elapsed * 0.52) * 7);
      rafRef.current = requestAnimationFrame(runFloat);
    }

    const onHide = () => {
      cancelAnimationFrame(rafRef.current);
      hiddenRef.current -= performance.now(); // record when hiding started
    };
    const onShow = () => {
      hiddenRef.current += performance.now(); // total hidden ms now positive
      rafRef.current = requestAnimationFrame(runFloat);
    };
    const onVisibility = () => { document.hidden ? onHide() : onShow(); };

    document.addEventListener('visibilitychange', onVisibility);
    rafRef.current = requestAnimationFrame(runFloat);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // floatY/refs are stable — empty deps array is intentional

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    rotY.set(((e.clientX - r.left) / r.width  - 0.5) * 13);
    rotX.set(-((e.clientY - r.top)  / r.height - 0.5) *  9);
  };
  const onMouseLeave = () => { rotX.set(0); rotY.set(0); };

  // Stat cards inside the dashboard — showing real data
  const DASH_STATS = [
    { label: 'Total Students', val: '2,847', delta: '+18.4%', up: true },
    { label: 'Revenue',        val: '₹4.2L', delta: '+8.1%',  up: true },
    { label: 'Attendance',     val: '94.6%', delta: '+2.2%',  up: true },
  ];

  return (
    <motion.div
      // dashboard is secondary — enter alongside subtext, not before
      initial={{ opacity: 0, y: 48, scale: 0.94 }}
      animate={{ opacity: 0.92, y: 0, scale: 1 }}
      transition={{ duration: DUR.CINEMATIC, delay: PHASE.DASHBOARD, ease: EASE.out }}
      className="relative w-full"
      style={{
        perspective: 1100,
        y: floatY,
        // subtle depth blur — dashboard recedes visually behind left copy
        filter: 'blur(0.4px)',
      }}
    >
      {/* Glow halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-12 rounded-3xl"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(109,40,217,0.18) 0%, rgba(37,99,235,0.10) 45%, transparent 70%)',
          filter: 'blur(48px)',
        }}
      />

      {/* 3-D tilt card */}
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX: sRotX, rotateY: sRotY, transformStyle: 'preserve-3d' }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0c0c10]/96 cursor-default"
        whileHover={{ scale: 1.010 }}
        transition={{ duration: 0.24, ease: EASE.out }}
      >
        {/* Inner shadow for depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            boxShadow: [
              'inset 0 1px 0 rgba(255,255,255,0.07)',
              '0 4px 16px rgba(0,0,0,0.42)',
              '0 32px 80px rgba(0,0,0,0.55)',
              '0 0 0 1px rgba(255,255,255,0.03)',
            ].join(', '),
          }}
        />

        <div className="p-5">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 pb-3 pt-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500/55" />
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-yellow-500/55" />
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-green-500/55" />
            <div className="mx-auto flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-3 py-[5px]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-55" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[10px] text-white/30">app.growcad.in</span>
            </div>
          </div>

          {/* Real KPI — students + sparkline */}
          <div className="mt-5 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/28">
                Students This Month
              </p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-[22px] font-bold tracking-tight text-white">2,847</span>
                <span className="mb-[3px] text-[12px] font-semibold text-emerald-400">↑ 18.4%</span>
              </div>
            </div>
            <svg viewBox="0 0 100 40" className="h-8 w-24 shrink-0" aria-hidden="true">
              <defs>
                <linearGradient id="hsg" x1="0" y1="0" x2="100%" y2="0">
                  <stop offset="0%"   stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <polyline
                points={BARS.map((v, i) =>
                  `${(i / (BARS.length - 1)) * 100},${40 - (v / 100) * 36}`
                ).join(' ')}
                fill="none" stroke="url(#hsg)"
                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Bar chart */}
          <div
            className="mt-5 flex items-end gap-[3px] overflow-hidden rounded-xl bg-white/[0.02] p-3"
            style={{ height: 84 }}
          >
            {BARS.map((_, idx) => (
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
                  delay:    PHASE.DASHBOARD + 0.12 + idx * 0.028,
                  duration: 0.36,
                  ease:     EASE.out,
                }}
              />
            ))}
          </div>

          {/* Three real stat cards — no synthetic data */}
          <div className="mt-4 flex gap-2">
            {DASH_STATS.map(m => (
              <div
                key={m.label}
                className="flex-1 rounded-xl border border-white/[0.055] bg-white/[0.025] p-2.5"
              >
                <p className="text-[9px] uppercase tracking-[0.12em] text-white/28">{m.label}</p>
                <p className="mt-[3px] text-[13px] font-bold leading-none text-white">{m.val}</p>
                <p className={`mt-1 text-[9.5px] font-semibold ${m.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {m.delta}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating notification pill */}
      <motion.div
        className="absolute -top-4 -right-4 z-10 flex items-center gap-2.5 rounded-2xl border border-violet-500/25 bg-[#0d0d14]/98 px-3.5 py-2.5 backdrop-blur-xl"
        style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.12)' }}
        initial={{ opacity: 0, y: 12, scale: 0.88 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        transition={{ delay: PHASE.PILLS, ...SPRING.normal }}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/20 ring-1 ring-violet-500/25">
          <svg className="h-3 w-3 text-violet-400" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M7.2 1.6L2 8h5.2L4.8 14.4 14 7.2H8.8L11.2 1.6z"/>
          </svg>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-white/85">New admission</p>
          <p className="text-[10px] text-white/40">Riya Sharma just enrolled</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const { navigate, isLoading } = useAppNavigation();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const rawY     = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const rawOp    = useTransform(scrollYProgress, [0, 0.48], [1, 0]);
  const contentY = useSpring(rawY, { damping: 32, stiffness: 100, mass: 0.6 });

  // Anime.js timeline for initial entrance (lazy, respects reduced-motion)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cancelled = false;

    loadAnimeTimeline()
      .then(({ runHeroTimeline }) => {
        if (!cancelled) {
          runHeroTimeline(
            '[data-hero="badge"]',
            '[data-hero="headline"]',
            '[data-hero="subtext"]',
            '[data-hero="cta"]',
          );
        }
      })
      .catch(() => { /* Framer Motion fallbacks fire automatically */ });

    return () => { cancelled = true; };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-scene={SCENES.hero}
      className="relative flex min-h-screen items-center pt-[clamp(5rem,10vh,7rem)] pb-[clamp(4rem,7.5vw,8.5rem)] px-[clamp(1.25rem,4vw,2.5rem)]"
    >
      {/* WebGL — absolute, zero layout impact */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ duration: 1.5, delay: 0.06 }}
      >
        <WebGLErrorBoundary>
          <Suspense fallback={null}>
            <BlobCanvas />
            <Particles />
          </Suspense>
        </WebGLErrorBoundary>
      </motion.div>

      {/* Ambient glows */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1]"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: [0.45, 0, 0.55, 1], repeatType: 'mirror' }}
        aria-hidden="true"
      >
        <div style={{ position: 'absolute', top: '4%',    left: '-8%',  width: 720, height: 720, background: 'radial-gradient(circle, rgba(109,40,217,0.09) 0%, transparent 62%)', filter: 'blur(90px)' }} />
        <div style={{ position: 'absolute', top: '28%',   right: '-6%', width: 560, height: 560, background: 'radial-gradient(circle, rgba(37,99,235,0.07)  0%, transparent 62%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '30%',  width: 460, height: 460, background: 'radial-gradient(circle, rgba(109,40,217,0.05) 0%, transparent 65%)', filter: 'blur(110px)'}} />
      </motion.div>

      {/* Content — two columns with scroll parallax */}
      <motion.div
        style={{ y: contentY, opacity: rawOp }}
        className={`relative z-[10] ${HERO_INNER} grid w-full grid-cols-1 items-center lg:grid-cols-[1.05fr_0.95fr]`}
      >
        {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <div className="flex flex-col w-full max-w-[clamp(460px,44vw,568px)] lg:pl-[clamp(0px,1.5vw,24px)]">

          {/* 1. Badge — first element to appear */}
          <motion.div
            data-hero="badge"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.SLOW, delay: PHASE.BADGE, ease: EASE.out }}
          >
            <Badge dot color="emerald">
              Trusted by 4,200+ coaching institutes
            </Badge>
          </motion.div>

          {/* 2. Headline — mt-2 (tight after badge, badge just sets context) */}
          <motion.h1
            data-hero="headline"
            className="mt-2 font-bold leading-[1.08] tracking-[-0.045em] text-white"
            style={{ fontSize: 'clamp(2.3rem, 4.2vw, 4.2rem)' }}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.SLOW, delay: PHASE.HEADLINE, ease: EASE.out }}
          >
            Your institute runs itself.
            <br />
            <RotatingWord />
          </motion.h1>

          {/* 3. Subtext — mt-3 (more air: headline is the hero, sub is the support) */}
          <motion.p
            data-hero="subtext"
            className="mt-3 leading-[1.78] text-white/55 max-w-[50ch]"
            style={{ fontSize: 'clamp(0.95rem, 1vw, 1.05rem)' }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.NORMAL, delay: PHASE.SUBTEXT, ease: EASE.soft }}
          >
            Manage admissions, fees, attendance, and communication —
            all automated in one dashboard. Nothing slips.
          </motion.p>

          {/* 4. Stats row — mt-4 (real numbers reinforce subtext claim) */}
          <motion.div
            className="mt-4 flex items-center gap-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.NORMAL, delay: PHASE.SUBTEXT + 0.12, ease: EASE.soft }}
          >
            {STATS.map((s, idx) => (
              <StatBlock key={s.label} {...s} delay={PHASE.SUBTEXT + 0.16 + idx * 0.08} />
            ))}
          </motion.div>

          {/* 5. CTAs — mt-6 (most breathing room: primary action needs space) */}
          <div data-hero="cta" className="mt-6">
            <motion.div
              className="flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DUR.NORMAL, delay: PHASE.CTA, ease: EASE.out }}
            >
              {/* Primary CTA — dominant scale, extra glow */}
              <MagneticButton
                variant="primary"
                className="!py-[14px] !px-8 animate-glow-pulse"
                onClick={() =>
                  navigate('signup', {
                    location: 'hero',
                    label:    'Start Free — Setup Your Institute',
                  })
                }
                loading={isLoading}
              >
                Start Free — Setup Your Institute
                <ArrowRight size={14} />
              </MagneticButton>

              {/* Secondary — visually subordinate */}
              <Button variant="secondary" size="md">
                <span className="mr-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px]">
                  ▶
                </span>
                Watch Demo (2 min)
              </Button>
            </motion.div>

            {/* Microcopy — mt-2.5 (close to CTA, part of the decision zone) */}
            <motion.p
              className="mt-2.5 text-[12px] tracking-[0.01em] text-white/36"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: DUR.FAST, delay: PHASE.MICROCOPY }}
            >
              Free forever on Starter · No card needed · Cancel anytime
            </motion.p>
          </div>

          {/* 6. Trust layer — mt-5 (after the CTA decision, reinforces with proof) */}
          <div className="mt-5">
            <TrustStrip delay={PHASE.PROOF} />
          </div>
        </div>

        {/* ── RIGHT COLUMN — dashboard (secondary visual) ──────────────────── */}
        <div className="relative hidden lg:flex lg:items-center lg:justify-end lg:pr-[clamp(6px,1.2vw,20px)]">
          <div className="w-full -translate-y-[1.5%] 2xl:scale-[0.992]">
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
        transition={{ delay: PHASE.SCROLL_CUE, duration: 0.9 }}
        aria-hidden="true"
      >
        <span className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-white/18">
          Scroll
        </span>
        <motion.div
          className="h-6 w-px origin-top bg-gradient-to-b from-white/22 to-transparent"
          animate={{ scaleY: [0.1, 1, 0.1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
