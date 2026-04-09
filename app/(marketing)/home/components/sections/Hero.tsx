'use client';

import { useRef, lazy, Suspense, useEffect, useState } from 'react';
import {
  motion, useScroll, useTransform, useSpring,
  AnimatePresence, useMotionValue,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import MagneticButton from '../ui/MagneticButton';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import WebGLErrorBoundary from '../core/WebGLErrorBoundary';
import SceneWrapper from '../core/SceneWrapper';
import {
  CONTAINER, SECTION_PY, SCENES,
  HERO_PHASES, T, EASE_OUT, DUR,
} from '../../systems/design';

const BlobCanvas = lazy(() => import('../webgl/BlobCanvas'));
const Particles  = lazy(() => import('../webgl/Particles'));

const WORDS = ['Grow faster.', 'Win with data.', 'Move as one team.', 'Ship more experiments.'];

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % WORDS.length), 2900);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-flex overflow-hidden align-bottom" style={{ height: '1.05em' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          className="block bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1, transition: { duration: 0.55, ease: EASE_OUT } }}
          exit={{ y: '-100%', opacity: 0, transition: { duration: 0.28, ease: EASE_OUT } }}
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const BARS = [34, 50, 40, 68, 56, 80, 64, 92, 72, 100, 84, 96];

function DashPreview() {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { damping: 26, stiffness: 200 });
  const sRotY = useSpring(rotY, { damping: 26, stiffness: 200 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    rotY.set(x * 14);
    rotX.set(-y * 10);
  };

  const onMouseLeave = () => { rotX.set(0); rotY.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, delay: HERO_PHASES.DASHBOARD, ease: EASE_OUT }}
      className="relative w-full"
      style={{ perspective: 1200 }}
    >
      {/* Glow layer behind card */}
      <div
        className="pointer-events-none absolute -inset-10 rounded-3xl"
        style={{
          background: 'radial-gradient(ellipse 85% 75% at 50% 50%, rgba(109,40,217,0.18) 0%, rgba(37,99,235,0.10) 45%, transparent 72%)',
          filter: 'blur(40px)',
        }}
      />

      {/* 3D tilt card */}
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX: sRotX,
          rotateY: sRotY,
          transformStyle: 'preserve-3d',
        }}
        className="relative rounded-2xl border border-white/[0.09] bg-[#0c0c10]/96 overflow-hidden cursor-default"
        whileHover={{ scale: 1.015 }}
        transition={{ duration: 0.28, ease: EASE_OUT }}
      >
        <div style={{
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 16px rgba(0,0,0,0.4), 0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03)',
          borderRadius: 'inherit',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }} />

        {/* Chrome bar */}
        <div className="flex items-center gap-2 border-b border-white/[0.05] bg-white/[0.012] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/55" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/55" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/55" />
          <div className="mx-auto flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-3 py-[5px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-55" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] text-white/30">app.growcad.io</span>
          </div>
        </div>

        <div className="p-5">
          {/* Revenue header */}
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">Monthly Revenue</p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-[22px] font-bold tracking-tight text-white">$2.4M</span>
                <span className="mb-[3px] text-[13px] font-semibold text-emerald-400">↑ 24.8%</span>
              </div>
            </div>
            <svg viewBox="0 0 100 40" className="h-8 w-24 flex-shrink-0">
              <defs>
                <linearGradient id="hsg" x1="0" y1="0" x2="100%" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <polyline
                points={BARS.map((v, i) => `${(i/(BARS.length-1))*100},${40-(v/100)*36}`).join(' ')}
                fill="none" stroke="url(#hsg)" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Chart */}
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

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Active Users', val: '84.2K', delta: '+9%',   up: true  },
              { label: 'Conversion',   val: '4.7%',  delta: '+1.2%', up: true  },
              { label: 'Churn Rate',   val: '0.9%',  delta: '−0.3%', up: false },
            ].map(m => (
              <div key={m.label} className="rounded-xl border border-white/[0.055] bg-white/[0.025] p-2.5">
                <p className="text-[9.5px] text-white/30">{m.label}</p>
                <p className="mt-[3px] text-[13px] font-bold leading-none text-white">{m.val}</p>
                <p className={`mt-1 text-[9.5px] font-semibold ${m.up ? 'text-emerald-400' : 'text-rose-400'}`}>{m.delta}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating badge */}
      <motion.div
        className="absolute -top-4 -right-4 z-10 flex items-center gap-2.5 rounded-2xl border border-violet-500/25 bg-[#0d0d14]/98 px-3.5 py-2.5 backdrop-blur-xl"
        style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.12)' }}
        initial={{ opacity: 0, y: 12, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: HERO_PHASES.PILLS, ...T.normal }}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/20 ring-1 ring-violet-500/25">
          <svg className="h-3 w-3 text-violet-400" viewBox="0 0 16 16" fill="currentColor">
            <path d="M7.2 1.6L2 8h5.2L4.8 14.4 14 7.2H8.8L11.2 1.6z"/>
          </svg>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-white/85">Revenue spiked</p>
          <p className="text-[10px] text-white/40">+$18.4K in last hour</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

  const rawY    = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const rawOp   = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const contentY = useSpring(rawY, { damping: 30, stiffness: 100 });

  return (
    <section
      ref={sectionRef}
      data-scene={SCENES.hero}
      className={`relative flex min-h-[100svh] items-center ${SECTION_PY.hero}`}
    >
      <SceneWrapper className="relative z-[10] w-full" exitScale={0.985}>
      {/* WebGL layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.70 }}
        transition={{ duration: 1.4, delay: 0.1, ease: EASE_OUT }}
      >
        <WebGLErrorBoundary>
          <Suspense fallback={null}>
            <BlobCanvas />
            <Particles />
          </Suspense>
        </WebGLErrorBoundary>
      </motion.div>

      {/* Ambient glows — floating, three-layer depth */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1]"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: [0.45, 0, 0.55, 1], repeatType: 'mirror' }}
      >
        <div style={{ position: 'absolute', top: '5%', left: '-10%', width: 740, height: 740, background: 'radial-gradient(circle, rgba(109,40,217,0.09) 0%, transparent 62%)', filter: 'blur(90px)' }} />
        <div style={{ position: 'absolute', top: '25%', right: '-8%', width: 580, height: 580, background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 62%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '30%', width: 480, height: 480, background: 'radial-gradient(circle, rgba(109,40,217,0.05) 0%, transparent 65%)', filter: 'blur(110px)' }} />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: rawOp }}
        className={`relative z-[10] ${CONTAINER.page} grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-16`}
      >
        {/* LEFT */}
        <div className="flex flex-col max-w-[580px]">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.12, ease: EASE_OUT }}
          >
            <Badge dot color="emerald">Trusted by 4,200+ teams · 300+ joined this month</Badge>
          </motion.div>

          <motion.h1
            className="mb-6 font-bold leading-[1.02] tracking-[-0.045em] text-white"
            style={{ fontSize: 'clamp(2.9rem, 5.2vw, 4.6rem)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, delay: 0.26, ease: EASE_OUT }}
          >
            Your data is ready.
            <br />
            <RotatingWord />
          </motion.h1>

          <motion.p
            className="mb-8 max-w-[480px] text-[1.0625rem] leading-[1.78] text-white/60"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.40, ease: EASE_OUT }}
          >
            One platform for analytics, experiments, and revenue data.
            See what is working, fix what is not, and ship faster — starting today.
          </motion.p>

          <motion.div
            className="mb-3 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.48, ease: EASE_OUT }}
          >
            <MagneticButton variant="primary" className="!py-[14px] !px-8 animate-glow-pulse">
              Start for free — see results in 5 min <ArrowRight size={14} />
            </MagneticButton>
            <Button variant="secondary" size="md">
              <span className="mr-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px]">▶</span>
              See it in action (2 min)
            </Button>
          </motion.div>

          <motion.p
            className="mb-10 text-[12.5px] tracking-[0.01em] text-white/42"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.56 }}
          >
            Free forever on Starter · No card needed · Cancel in one click
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.62, ease: EASE_OUT }}
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
            <p className="text-[13px] text-white/50">
              <span className="font-semibold text-white">2,800+</span> teams switched from Mixpanel, Amplitude, or both
            </p>
            <div className="flex items-center gap-0.5">
              {'★★★★★'.split('').map((s, idx) => (
                <span key={idx} className="text-[12px] text-amber-400/85">{s}</span>
              ))}
              <span className="ml-1 text-[12px] font-semibold text-white/75">4.9</span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT — dashboard with 3D tilt */}
        <div className="relative hidden lg:flex lg:items-center lg:justify-end lg:pr-2">
          <div className="w-full max-w-[440px]">
            <DashPreview />
          </div>
        </div>
      </motion.div>

      </SceneWrapper>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-[10] -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: rawOp }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: HERO_PHASES.SCROLL_CUE, duration: 0.8 }}
      >
        <span className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-white/18">Scroll</span>
        <motion.div
          className="h-6 w-px origin-top bg-gradient-to-b from-white/22 to-transparent"
          animate={{ scaleY: [0.1, 1, 0.1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
