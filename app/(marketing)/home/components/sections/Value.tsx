'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { BrainCircuit, BarChart2, Zap, Globe2, Lock, RefreshCw } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Reveal from '../motion/Reveal';
import { CONTAINER, SECTION_PY, SCENES, staggerDelay, DUR, EASE_OUT, HIERARCHY } from '../../systems/design';

// ─── Feature data ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    Icon: BrainCircuit,
    title: 'AI-Native Intelligence',
    desc: 'Surface anomalies, predict churn, and auto-generate executive summaries — before you even ask.',
    accent: 'from-violet-500/15 to-transparent',
    iconBg: 'bg-violet-500/10',
    iconRing: 'ring-violet-500/14',
    iconClr: 'text-violet-400',
    glowClr: 'rgba(139,92,246,0.16)',
    span: 'md:col-span-2',
    tag: 'Flagship',
    tagColor: 'text-violet-300 border-violet-500/20 bg-violet-500/10',
  },
  {
    Icon: BarChart2,
    title: 'Unified Analytics',
    desc: 'Every metric, funnel, and cohort in one composable workspace. No BI tool required.',
    accent: 'from-blue-500/13 to-transparent',
    iconBg: 'bg-blue-500/10', iconRing: 'ring-blue-500/14', iconClr: 'text-blue-400',
    glowClr: 'rgba(59,130,246,0.14)', span: '', tag: null, tagColor: '',
  },
  {
    Icon: Zap,
    title: 'Instant Experiments',
    desc: 'Ship A/B tests in seconds. Statistical confidence, not hope.',
    accent: 'from-amber-500/12 to-transparent',
    iconBg: 'bg-amber-500/10', iconRing: 'ring-amber-500/14', iconClr: 'text-amber-400',
    glowClr: 'rgba(245,158,11,0.14)', span: '', tag: null, tagColor: '',
  },
  {
    Icon: Globe2,
    title: 'Global Edge CDN',
    desc: 'P99 under 12ms across 40+ regions. Your data everywhere, instantly.',
    accent: 'from-cyan-500/12 to-transparent',
    iconBg: 'bg-cyan-500/10', iconRing: 'ring-cyan-500/14', iconClr: 'text-cyan-400',
    glowClr: 'rgba(6,182,212,0.13)', span: '', tag: null, tagColor: '',
  },
  {
    Icon: Lock,
    title: 'Enterprise Security',
    desc: 'SOC 2 Type II · GDPR · HIPAA. Encrypted, audited, yours.',
    accent: 'from-emerald-500/12 to-transparent',
    iconBg: 'bg-emerald-500/10', iconRing: 'ring-emerald-500/14', iconClr: 'text-emerald-400',
    glowClr: 'rgba(16,185,129,0.13)', span: '', tag: null, tagColor: '',
  },
  {
    Icon: RefreshCw,
    title: 'Real-time Sync',
    desc: '500+ native integrations. Zero-lag pipelines via webhooks, API, and SDK.',
    accent: 'from-pink-500/11 to-transparent',
    iconBg: 'bg-pink-500/10', iconRing: 'ring-pink-500/14', iconClr: 'text-pink-400',
    glowClr: 'rgba(236,72,153,0.12)', span: '', tag: null, tagColor: '',
  },
];

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ f, i }: { f: typeof FEATURES[0]; i: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={f.span}
      initial={{ opacity: 0, y: reduce ? 0 : 36, filter: reduce ? 'none' : 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: 0.68 + i * 0.04,
        delay: staggerDelay(i, 0.04),
        ease: EASE_OUT,
      }}
    >
      <GlassCard tilt glow glowColor={f.glowClr} className="group h-full cursor-default">
        {/* Hover accent — visible hierarchy: hover reveals deeper layer */}
        <motion.div
          className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${f.accent}`}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Tag — primary indicator */}
        {f.tag && (
          <motion.span
            className={`mb-4 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${f.tagColor}`}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <span className="h-1 w-1 rounded-full bg-current opacity-70" />
            {f.tag}
          </motion.span>
        )}

        {/* Icon — scales on hover (tactile feedback) */}
        <div className="relative mb-5 inline-flex">
          <div
            className={[
              'flex items-center justify-center rounded-xl p-3 ring-1',
              f.iconBg, f.iconRing,
              'transition-all duration-300',
              'group-hover:scale-110',
            ].join(' ')}
          >
            <f.Icon size={19} className={f.iconClr} />
          </div>
        </div>

        {/* Title — primary */}
        <h3 className={`mb-2.5 text-[15px] font-semibold tracking-tight ${HIERARCHY.primary}`}>
          {f.title}
        </h3>

        {/* Description — secondary (reduced opacity = lower hierarchy) */}
        <p className={`text-[13px] leading-[1.65] ${HIERARCHY.secondary}`}>{f.desc}</p>

        {/* Arrow — tertiary, reveals on hover */}
        <div className={`mt-5 flex items-center gap-1 text-[12px] font-medium transition-colors duration-200 ${HIERARCHY.muted} group-hover:text-white/52`}>
          Explore feature
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            →
          </motion.span>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Value() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  // Subtle ambient parallax — right glow moves with scroll
  const ambientX = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  return (
    <section
      ref={sectionRef}
      data-scene={SCENES.value}
      className={`relative ${SECTION_PY.lg}`}
    >
      <div className="section-divider" />

      {/* Ambient — moves opposite to scroll for depth */}
      <motion.div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"
        style={{ x: ambientX }}
      >
        <div
          style={{
            width: 560, height: 560,
            background: 'radial-gradient(circle, rgba(37,99,235,0.045) 0%, transparent 68%)',
            filter: 'blur(80px)',
          }}
        />
      </motion.div>
      {/* Left ambient */}
      <div
        className="pointer-events-none absolute left-0 top-1/4"
        style={{
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(109,40,217,0.04) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className={CONTAINER.page}>
        {/* ── Scene narrative header ── */}
        <Reveal className="mb-20 text-center">
          {/*
            Visual hierarchy:
            - Label: tertiary (muted, sets scene context)
            - H2 line 1: primary (full white, dominant)
            - H2 line 2: secondary (reduced opacity, contrast sets up punch)
            - Subtext: secondary/tertiary
          */}
          <p className="scene-label mb-4">Why Growcad</p>
          <h2
            className="mb-5 font-bold leading-[1.1] tracking-[-0.028em]"
            style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.2rem)' }}
          >
            <span className="text-white">Everything your growth team</span>
            <br />
            <span className="text-white/28">actually needs.</span>
          </h2>
          <p className="mx-auto max-w-lg text-[15px] leading-relaxed text-white/36">
            Not another dashboard. A system that thinks alongside your team —
            automating the grunt work so you ship faster.
          </p>
        </Reveal>

        {/* ── Feature grid ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {FEATURES.map((f, i) => <FeatureCard key={f.title} f={f} i={i} />)}
        </div>
      </div>
    </section>
  );
}
