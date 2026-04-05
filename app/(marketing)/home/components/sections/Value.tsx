'use client';

import {
  useRef, useEffect, useState, useCallback,
} from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { BrainCircuit, BarChart2, Zap, Globe2, Lock, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Reveal from '../motion/Reveal';
import {
  CONTAINER, SECTION_PY, SCENES,
  T, DUR, EASE_OUT, HIERARCHY,
} from '../../systems/design';

// ─── Feature data (unchanged from grid version) ────────────────────────────
const FEATURES = [
  {
    Icon: BrainCircuit,
    title: 'AI-Native Intelligence',
    desc: 'Surface anomalies, predict churn, and auto-generate executive summaries — before you even ask.',
    accent:   'from-violet-500/15 to-transparent',
    iconBg:   'bg-violet-500/10',
    iconRing: 'ring-violet-500/14',
    iconClr:  'text-violet-400',
    glowClr:  'rgba(139,92,246,0.22)',
    glowActive: 'rgba(139,92,246,0.38)',
    tag:      'Flagship',
    tagColor: 'text-violet-300 border-violet-500/20 bg-violet-500/10',
    accentRgb: '139,92,246',
  },
  {
    Icon: BarChart2,
    title: 'Unified Analytics',
    desc: 'Every metric, funnel, and cohort in one composable workspace. No BI tool required.',
    accent:   'from-blue-500/13 to-transparent',
    iconBg:   'bg-blue-500/10',
    iconRing: 'ring-blue-500/14',
    iconClr:  'text-blue-400',
    glowClr:  'rgba(59,130,246,0.18)',
    glowActive: 'rgba(59,130,246,0.36)',
    tag: null, tagColor: '',
    accentRgb: '59,130,246',
  },
  {
    Icon: Zap,
    title: 'Instant Experiments',
    desc: 'Ship A/B tests in seconds. Statistical confidence, not hope.',
    accent:   'from-amber-500/12 to-transparent',
    iconBg:   'bg-amber-500/10',
    iconRing: 'ring-amber-500/14',
    iconClr:  'text-amber-400',
    glowClr:  'rgba(245,158,11,0.18)',
    glowActive: 'rgba(245,158,11,0.34)',
    tag: null, tagColor: '',
    accentRgb: '245,158,11',
  },
  {
    Icon: Globe2,
    title: 'Global Edge CDN',
    desc: 'P99 under 12ms across 40+ regions. Your data everywhere, instantly.',
    accent:   'from-cyan-500/12 to-transparent',
    iconBg:   'bg-cyan-500/10',
    iconRing: 'ring-cyan-500/14',
    iconClr:  'text-cyan-400',
    glowClr:  'rgba(6,182,212,0.18)',
    glowActive: 'rgba(6,182,212,0.34)',
    tag: null, tagColor: '',
    accentRgb: '6,182,212',
  },
  {
    Icon: Lock,
    title: 'Enterprise Security',
    desc: 'SOC 2 Type II · GDPR · HIPAA. Encrypted, audited, yours.',
    accent:   'from-emerald-500/12 to-transparent',
    iconBg:   'bg-emerald-500/10',
    iconRing: 'ring-emerald-500/14',
    iconClr:  'text-emerald-400',
    glowClr:  'rgba(16,185,129,0.18)',
    glowActive: 'rgba(16,185,129,0.34)',
    tag: null, tagColor: '',
    accentRgb: '16,185,129',
  },
  {
    Icon: RefreshCw,
    title: 'Real-time Sync',
    desc: '500+ native integrations. Zero-lag pipelines via webhooks, API, and SDK.',
    accent:   'from-pink-500/11 to-transparent',
    iconBg:   'bg-pink-500/10',
    iconRing: 'ring-pink-500/14',
    iconClr:  'text-pink-400',
    glowClr:  'rgba(236,72,153,0.18)',
    glowActive: 'rgba(236,72,153,0.34)',
    tag: null, tagColor: '',
    accentRgb: '236,72,153',
  },
];

// ─── Single feature card ───────────────────────────────────────────────────
interface FeatureCardProps {
  f:        typeof FEATURES[0];
  i:        number;
  isActive: boolean;
  cardRef:  (el: HTMLDivElement | null) => void;
}

function FeatureCard({ f, i, isActive, cardRef }: FeatureCardProps) {
  /**
   * State is expressed entirely through CSS transitions — no Framer
   * animate/whileInView on the card-level transform, because these fire
   * on every scroll tick (60+ fps). CSS transitions run off the React
   * render cycle on the GPU compositor.
   *
   * active  → scale(1)    opacity(1)    blur(0px)   padding(40px)  glow-strong
   * inactive → scale(0.90) opacity(0.55) blur(1px)   padding(24px)  glow-faint
   */
  const transition = 'transform 0.42s cubic-bezier(0.16,1,0.3,1), opacity 0.42s cubic-bezier(0.16,1,0.3,1), filter 0.42s cubic-bezier(0.16,1,0.3,1), box-shadow 0.42s cubic-bezier(0.16,1,0.3,1), padding 0.42s cubic-bezier(0.16,1,0.3,1)';

  // Multi-layer shadow: tighter on inactive, full depth on active
  const restShadow = [
    `inset 0 1px 0 rgba(${f.accentRgb},0.05)`,
    '0 4px 24px rgba(0,0,0,0.3)',
    '0 16px 48px rgba(0,0,0,0.25)',
  ].join(', ');

  const activeShadow = [
    `inset 0 1px 0 rgba(${f.accentRgb},0.12)`,
    '0 4px 24px rgba(0,0,0,0.45)',
    '0 24px 72px rgba(0,0,0,0.5)',
    `0 0 48px rgba(${f.accentRgb},0.2)`,
    `0 0 100px rgba(${f.accentRgb},0.08)`,
  ].join(', ');

  return (
    <div
      ref={cardRef}
      className="snap-center flex-shrink-0 w-[85vw] max-w-[340px] md:w-[420px]"
      style={{
        transition,
        transform:  isActive ? 'scale(1)'     : 'scale(0.90)',
        opacity:    isActive ? 1              : 0.55,
        filter:     isActive ? 'blur(0px)'    : 'blur(1px)',
        willChange: 'transform, opacity, filter',
      }}
    >
      {/*
        GlassCard wraps the content. We pass `lift={false}` because
        lift is driven by isActive state here, not hover.
        The active glow is controlled via boxShadow on the wrapper.
      */}
      <div
        className="relative h-full overflow-hidden rounded-2xl border border-white/[0.07] backdrop-blur-[10px] group cursor-default"
        style={{
          background: 'rgba(255,255,255,0.026)',
          padding: isActive ? '40px' : '24px',
          boxShadow: isActive ? activeShadow : restShadow,
          transition,
          // border color brightens on active
          borderColor: isActive
            ? `rgba(${f.accentRgb},0.22)`
            : 'rgba(255,255,255,0.07)',
        }}
      >
        {/* ── Decoration layers (match GlassCard internals) ── */}

        {/* Top-edge light reflection */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: isActive
              ? `linear-gradient(90deg, transparent, rgba(${f.accentRgb},0.5), transparent)`
              : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
            transition: 'background 0.42s cubic-bezier(0.16,1,0.3,1)',
          }}
        />

        {/* Top-left catch-light */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 55%)',
          }}
        />

        {/* Accent gradient (visible on active) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, rgba(${f.accentRgb},0.09), transparent 60%)`,
            opacity: isActive ? 1 : 0,
            transition: 'opacity 0.42s cubic-bezier(0.16,1,0.3,1)',
          }}
        />

        {/* Bottom contact shadow accent */}
        <div
          className="pointer-events-none absolute inset-x-4 -bottom-px h-px"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${f.accentRgb},0.4), transparent)`,
            opacity: isActive ? 1 : 0,
            filter: 'blur(2px)',
            transition: 'opacity 0.42s cubic-bezier(0.16,1,0.3,1)',
          }}
        />

        {/* ── Card content ── */}

        {/* Tag */}
        {f.tag && (
          <motion.span
            className={`mb-4 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${f.tagColor}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <span className="h-1 w-1 rounded-full bg-current opacity-70" />
            {f.tag}
          </motion.span>
        )}

        {/* Icon */}
        <div className="relative mb-5 inline-flex">
          <div
            className={[
              'flex items-center justify-center rounded-xl p-3 ring-1',
              f.iconBg, f.iconRing,
              'transition-all duration-300',
            ].join(' ')}
            style={{
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
              boxShadow: isActive ? `0 0 24px rgba(${f.accentRgb},0.28)` : 'none',
              transition: 'transform 0.42s cubic-bezier(0.16,1,0.3,1), box-shadow 0.42s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <f.Icon
              size={isActive ? 22 : 19}
              className={f.iconClr}
              style={{ transition: 'width 0.42s, height 0.42s' }}
            />
          </div>
        </div>

        {/* Title */}
        <h3
          className="mb-2.5 font-semibold tracking-tight"
          style={{
            fontSize: isActive ? '17px' : '15px',
            color: isActive ? '#ffffff' : 'rgba(255,255,255,0.85)',
            transition: 'font-size 0.42s cubic-bezier(0.16,1,0.3,1), color 0.3s',
          }}
        >
          {f.title}
        </h3>

        {/* Description */}
        <p
          className="leading-[1.68]"
          style={{
            fontSize: isActive ? '14px' : '13px',
            color: isActive ? 'rgba(255,255,255,0.52)' : 'rgba(255,255,255,0.32)',
            transition: 'font-size 0.42s cubic-bezier(0.16,1,0.3,1), color 0.3s',
          }}
        >
          {f.desc}
        </p>

        {/* Arrow link — only fully visible on active */}
        <div
          className="mt-5 flex items-center gap-1 text-[12px] font-medium"
          style={{
            color: isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)',
            transition: 'color 0.3s',
          }}
        >
          Explore feature
          <motion.span
            animate={{ x: isActive ? [0, 4, 0] : 0 }}
            transition={{ duration: 1.8, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
          >
            →
          </motion.span>
        </div>
      </div>
    </div>
  );
}

// ─── Carousel ─────────────────────────────────────────────────────────────
function FeatureCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [canLeft,   setCanLeft]   = useState(false);
  const [canRight,  setCanRight]  = useState(true);
  // Show swipe hint briefly, then fade it out after first interaction
  const [hintVisible, setHintVisible] = useState(true);

  // ── IntersectionObserver — same pattern as Testimonials ────────────────
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ratios = new Array(FEATURES.length).fill(0);
    const observers: IntersectionObserver[] = [];

    FEATURES.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            ratios[i] = entry.intersectionRatio;
            const maxIdx = ratios.indexOf(Math.max(...ratios));
            setActiveIdx(maxIdx);
          });
        },
        {
          root:       track,
          rootMargin: '0px -30% 0px -30%', // center 40% of container triggers
          threshold:  [0, 0.25, 0.5, 0.75, 1],
        }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // ── Arrow / hint state via scroll listener ──────────────────────────────
  const updateScroll = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    setCanLeft(t.scrollLeft > 8);
    setCanRight(t.scrollLeft < t.scrollWidth - t.clientWidth - 8);
    // Hide hint once user has scrolled
    if (t.scrollLeft > 20) setHintVisible(false);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
    return () => track.removeEventListener('scroll', updateScroll);
  }, [updateScroll]);

  

  // ── Scroll to a specific card index ────────────────────────────────────
  const scrollToCard = useCallback((idx: number) => {
    const track = trackRef.current;
    const card  = cardRefs.current[idx];
    if (!track || !card) return;
    const center = track.getBoundingClientRect().width / 2;
    track.scrollTo({
      left:     card.offsetLeft + card.offsetWidth / 2 - center,
      behavior: 'smooth',
    });
    setHintVisible(false);
  }, []);

  // ── Keyboard navigation (accessibility) ────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  scrollToCard(Math.max(0, activeIdx - 1));
      if (e.key === 'ArrowRight') scrollToCard(Math.min(FEATURES.length - 1, activeIdx + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIdx, scrollToCard]);

  const prev = () => scrollToCard(Math.max(0, activeIdx - 1));
  const next = () => scrollToCard(Math.min(FEATURES.length - 1, activeIdx + 1));

  return (
    <div className="relative">
      {/* ── Left arrow ── */}
      <AnimatePresence>
        {canLeft && (
          <motion.button
            key="val-left"
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-[#0c0c10]/90 text-white/60 backdrop-blur-md hover:border-white/[0.22] hover:text-white transition-colors duration-200"
            onClick={prev}
            aria-label="Previous feature"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{   opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{  scale: 0.93 }}
            transition={T.fast}
          >
            <ChevronLeft size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Right arrow ── */}
      <AnimatePresence>
        {canRight && (
          <motion.button
            key="val-right"
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-[#0c0c10]/90 text-white/60 backdrop-blur-md hover:border-white/[0.22] hover:text-white transition-colors duration-200"
            onClick={next}
            aria-label="Next feature"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{   opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{  scale: 0.93 }}
            transition={T.fast}
          >
            <ChevronRight size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Scroll track ── */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 pb-8"
        style={{
          scrollbarWidth:  'none',
          msOverflowStyle: 'none',
          // Edge-fade: cards emerge from/dissolve into background
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)',
        }}
      >
        {/* Leading spacer — makes first card centerable */}
        <div
          className="flex-shrink-0 w-[calc((100vw-340px)/2)] md:w-[calc((100vw-420px)/2)]"
          aria-hidden="true"
        />

        {FEATURES.map((f, i) => (
          <FeatureCard
            key={f.title}
            f={f}
            i={i}
            isActive={i === activeIdx}
            cardRef={(el) => { cardRefs.current[i] = el; }}
          />
        ))}

        {/* Trailing spacer — makes last card centerable */}
        <div
          className="flex-shrink-0 w-[calc(50vw-160px)] md:w-[calc(50vw-210px)]"
          aria-hidden="true"
        />
      </div>

      {/* ── Dot nav ── */}
      <div
        className="mt-4 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Feature navigation"
      >
        {FEATURES.map((f, i) => (
          <button
            key={f.title}
            role="tab"
            aria-selected={i === activeIdx}
            aria-label={`View feature: ${f.title}`}
            onClick={() => scrollToCard(i)}
            className="flex items-center justify-center p-1"
          >
            <motion.div
              className="rounded-full"
              style={{
                // Active dot uses feature accent color — a satisfying per-card detail
                background: i === activeIdx
                  ? `rgba(${f.accentRgb}, 0.9)`
                  : 'rgba(255,255,255,0.22)',
              }}
              animate={{
                width:   i === activeIdx ? 20 : 6,
                height:  6,
                opacity: i === activeIdx ? 1  : 0.5,
              }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            />
          </button>
        ))}
      </div>

      {/* ── Swipe hint ── */}
      <AnimatePresence>
        {hintVisible && (
          <motion.div
            className="mt-6 flex items-center justify-center gap-2 select-none"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -4 }}
            transition={{ delay: 0.8, duration: 0.5, ease: EASE_OUT }}
          >
            {/* Left swipe arrow */}
            <motion.span
              className={`text-[11px] font-mono ${HIERARCHY.muted}`}
              animate={{ x: [-3, 0, -3] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              ←
            </motion.span>

            <span
              className={`text-[11px] font-medium uppercase tracking-[0.18em] ${HIERARCHY.muted}`}
            >
              swipe to explore
            </span>

            {/* Right swipe arrow */}
            <motion.span
              className={`text-[11px] font-mono ${HIERARCHY.muted}`}
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            >
              →
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────
export default function Value() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  // Ambient glow parallaxes horizontally with scroll — retained from grid version
  const ambientX = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  return (
    <section
      ref={sectionRef}
      data-scene={SCENES.value}
      className={`relative ${SECTION_PY.lg}`}
    >
      <div className="section-divider" />

      {/* Ambient glow — moves opposite to scroll for depth */}
      <motion.div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"
        style={{ x: ambientX }}
      >
        <div
          style={{
            width: 580, height: 580,
            background: 'radial-gradient(circle, rgba(37,99,235,0.045) 0%, transparent 68%)',
            filter: 'blur(80px)',
          }}
        />
      </motion.div>
      <div
        className="pointer-events-none absolute left-0 top-1/4"
        style={{
          width: 420, height: 420,
          background: 'radial-gradient(circle, rgba(109,40,217,0.04) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* ── Header — constrained to standard container ── */}
      <div className={CONTAINER.page}>
        <Reveal className="mb-16 text-center">
          {/*
            Visual hierarchy (unchanged from grid version):
            scene-label → tertiary context setter
            "Why Growcad wins" → primary headline (updated per spec)
            sub-headline → secondary (reduced white)
            body copy → tertiary
          */}
          <p className="scene-label mb-4">Why Growcad</p>
          <h2
            className="mb-5 font-bold leading-[1.1] tracking-[-0.028em]"
            style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.2rem)' }}
          >
            <span className="text-white">Why Growcad wins</span>
            <br />
            <span className="text-white/28">everything your team needs.</span>
          </h2>
          <p className="mx-auto max-w-lg text-[15px] leading-relaxed text-white/36">
            Not another dashboard. A system that thinks alongside your team —
            automating the grunt work so you ship faster.
          </p>
        </Reveal>
      </div>

      {/*
        Carousel is outside the constrained container so it can bleed
        edge-to-edge. The internal mask-image creates the cinematic
        cards-emerging-from-darkness effect.
      */}
      <FeatureCarousel />
    </section>
  );
}
