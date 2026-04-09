'use client';

import {
  useRef, useEffect, useState, useCallback,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Reveal from '../motion/Reveal';
import SceneWrapper from '../core/SceneWrapper';
import {
  CONTAINER, SECTION_PY, SCENES,
  T, DUR, EASE_OUT,
  HIERARCHY,
} from '../../systems/design';

// ─── Data ─────────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "We replaced four separate tools with Growcad. Our data is finally a source of truth, not a source of endless arguments.",
    name: 'Marcus Liu',   role: 'VP of Product',   co: 'Fathom',      color: '#7c3aed', stars: 5,
  },
  {
    quote: "The experiment engine alone is worth the price. We shipped 60 A/B tests in Q1. We used to do six a quarter.",
    name: 'Priya Nair',   role: 'Growth Lead',     co: 'Render',      color: '#2563eb', stars: 5,
  },
  {
    quote: "Onboarding took 20 minutes. The first insight took 5. I've never felt that fast with a data tool.",
    name: 'Tom Briggs',   role: 'Head of Ops',     co: 'Railway',     color: '#059669', stars: 5,
  },
  {
    quote: "The AI summaries are scary good. It caught a 15% activation drop we'd have missed for weeks.",
    name: 'Yuki Tanaka',  role: 'Data Engineer',   co: 'Trigger.dev', color: '#dc2626', stars: 5,
  },
  {
    quote: "Best DX in the analytics space, bar none. The SDK is clean, APIs are predictable, and docs actually work.",
    name: 'Alex Mercer',  role: 'Senior Engineer', co: 'Unkey',       color: '#d97706', stars: 5,
  },
  {
    quote: "Switched from Mixpanel + Amplitude + Heap. I'm not going back. Ever.",
    name: 'Sofia Mendez', role: 'CEO',             co: 'Loops',       color: '#7c3aed', stars: 5,
  },
];
const CAROUSEL = {
  transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',

  active: {
    transform: 'scale(1)',
    opacity: 1,
    filter: 'blur(0px)',
    zIndex: 2,
  },

  inactive: {
    transform: 'scale(0.92)',
    opacity: 0.55,
    filter: 'blur(1px)',
    zIndex: 1,
  },
};

// ─── Card component ───────────────────────────────────────────────────────────
interface CardProps {
  t:        typeof TESTIMONIALS[0];
  i:        number;
  isActive: boolean;
  cardRef: (el: HTMLDivElement | null) => void;
}

function TestimonialCard({ t, i, isActive, cardRef }: CardProps) {
  return (
    /*
     * snap-center: card snaps to center of scroll container
     * flex-shrink-0: cards never squish — all same width
     * Transition on transform + opacity + filter:
     *   active  → scale-100 opacity-100 blur-0
     *   inactive → scale-90 opacity-60 blur-[1px]
     */
    <div
      ref={cardRef}
      className="snap-center flex-shrink-0 w-[320px] md:w-[380px]"
      style={{
        // Use CSS transitions rather than Framer on these — smoother
        // for continuous scroll-driven state changes
        transition: CAROUSEL.transition,
        transform:  isActive ? CAROUSEL.active.transform  : CAROUSEL.inactive.transform,
        opacity:    isActive ? CAROUSEL.active.opacity    : CAROUSEL.inactive.opacity,
        filter:     isActive ? CAROUSEL.active.filter     : CAROUSEL.inactive.filter,
        zIndex:     isActive ? CAROUSEL.active.zIndex     : CAROUSEL.inactive.zIndex,
        willChange: 'transform, opacity, filter',
      }}
    >
      <GlassCard
        glow
        glowColor={`${t.color}22`}
        className="group h-full cursor-default"
        lift={isActive}
      >
        {/* Color tint — only visible on active card hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${t.color}0e, transparent 55%)`,
            opacity: isActive ? 0 : 0,
          }}
        />

        {/* Active indicator — top edge accent line */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl transition-opacity duration-400"
          style={{
            background: `linear-gradient(90deg, transparent, ${t.color}88, transparent)`,
            opacity: isActive ? 1 : 0,
          }}
        />

        {/* Quote mark + stars row */}
        <div className="mb-4 flex items-start justify-between">
          <div
            className="font-serif text-[34px] leading-none transition-colors duration-300"
            style={{ color: isActive ? `${t.color}44` : 'rgba(255,255,255,0.1)' }}
          >
            &ldquo;
          </div>

          {/* Stars — spring stagger on mount */}
          <div className="flex gap-0.5">
            {Array.from({ length: t.stars }).map((_, si) => (
              <motion.span
                key={si}
                className="text-[11px]"
                style={{ color: isActive ? 'rgba(251,191,36,0.75)' : 'rgba(251,191,36,0.35)' }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.3 + i * 0.04 + si * 0.05,
                  duration: 0.28,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              >
                ★
              </motion.span>
            ))}
          </div>
        </div>

        {/* Quote body */}
        <p
          className="mb-6 text-[13.5px] leading-[1.72] transition-colors duration-300 text-white/60"
          style={{ color: isActive ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.48)' }}
        >
          {t.quote}
        </p>

        {/* Author */}
        <div className="mt-auto flex items-center gap-3">
          <div
            className="relative h-9 w-9 flex-shrink-0 rounded-full flex items-center justify-center text-[12px] font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${t.color}ee, ${t.color}66)`,
              boxShadow:  `0 0 0 2px ${t.color}${isActive ? '44' : '1a'}`,
              transition: 'box-shadow 0.3s ease',
            }}
          >
            {t.name[0]}
          </div>
          <div>
            <p
              className="text-[13px] font-semibold transition-colors duration-300"
              style={{ color: isActive ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.52)' }}
            >
              {t.name}
            </p>
            <p className={`text-[11px] ${HIERARCHY.tertiary}`}>{t.role}, {t.co}</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── Carousel ─────────────────────────────────────────────────────────────────
function Carousel() {
  const trackRef  = useRef<HTMLDivElement>(null);
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([]);

  // Active card index — driven by IntersectionObserver
  const [activeIdx, setActiveIdx]   = useState(0);
  // Whether we can scroll left/right (for arrow state)
  const [canLeft,  setCanLeft]     = useState(false);
  const [canRight, setCanRight]    = useState(true);

  // ── Intersection Observer ───────────────────────────────────────────────────
  /*
   * Each card observes itself. The card that is most "centered"
   * (intersectionRatio closest to 1.0 with a center-biased rootMargin)
   * is marked active.
   *
   * rootMargin: "-35% 0px -35% 0px" means only cards in the middle
   * 30% of the scroll container can trigger active state.
   *
   * This is more reliable than scroll-position math which breaks
   * on variable card widths, different viewport sizes, or padding changes.
   */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observers: IntersectionObserver[] = [];

    // Track intersection ratios per card and pick the highest
    const ratios = new Array(TESTIMONIALS.length).fill(0);

    TESTIMONIALS.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            ratios[i] = entry.intersectionRatio;
            // Find card with highest intersection — that's the active one
            const maxIdx = ratios.indexOf(Math.max(...ratios));
            setActiveIdx(maxIdx);
          });
        },
        {
          root:       track,
          rootMargin: '0px -28% 0px -28%', // center ~44% of viewport triggers
          threshold:  [0, 0.25, 0.5, 0.75, 1],
        }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // ── Arrow scroll state ─────────────────────────────────────────────────────
  const updateArrows = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    setCanLeft(t.scrollLeft > 8);
    setCanRight(t.scrollLeft < t.scrollWidth - t.clientWidth - 8);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener('scroll', updateArrows, { passive: true });
    updateArrows();
    return () => track.removeEventListener('scroll', updateArrows);
  }, [updateArrows]);

  // ── Scroll to card ─────────────────────────────────────────────────────────
  const scrollToCard = useCallback((idx: number) => {
    const track = trackRef.current;
    const card  = cardRefs.current[idx];
    if (!track || !card) return;

    // Center the card in the track
    const trackCenter = track.getBoundingClientRect().width / 2;
    const cardCenter  = card.offsetLeft + card.offsetWidth / 2;
    track.scrollTo({ left: cardCenter - trackCenter, behavior: 'smooth' });
  }, []);

  const prev = () => scrollToCard(Math.max(0, activeIdx - 1));
  const next = () => scrollToCard(Math.min(TESTIMONIALS.length - 1, activeIdx + 1));

  return (
    <div className="relative">
      {/* ── Left arrow ── */}
      <AnimatePresence>
        {canLeft && (
          <motion.button
            key="arrow-left"
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 -translate-x-2 hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-[#0c0c10]/90 text-white/60 backdrop-blur-md hover:border-white/[0.22] hover:text-white transition-colors duration-200"
            onClick={prev}
            aria-label="Previous testimonial"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1   }}
            exit={{   opacity: 0, scale: 0.8  }}
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
            key="arrow-right"
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 translate-x-2 hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-[#0c0c10]/90 text-white/60 backdrop-blur-md hover:border-white/[0.22] hover:text-white transition-colors duration-200"
            onClick={next}
            aria-label="Next testimonial"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1   }}
            exit={{   opacity: 0, scale: 0.8  }}
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
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-12"
        style={{
          // Hide scrollbar visually — keep scroll functionality
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          // Fade left/right edges into bg — cinematic reveal
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        {/* Leading spacer — centers first card */}
        <div className="flex-shrink-0 w-[calc(50vw-160px)] md:w-[calc(50vw-190px)]" aria-hidden="true" />

        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard
            key={t.name}
            t={t}
            i={i}
            isActive={i === activeIdx}
            cardRef={(el) => {
              cardRefs.current[i] = el;
            }}
          />
        ))}

        {/* Trailing spacer — centers last card */}
        <div className="flex-shrink-0 w-[calc(50vw-160px)] md:w-[calc(50vw-190px)]" aria-hidden="true" />
      </div>

      {/* ── Dot indicators ── */}
      <div className="mt-8 flex items-center justify-center gap-2" role="tablist" aria-label="Testimonial navigation">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === activeIdx}
            aria-label={`Go to testimonial ${i + 1}`}
            onClick={() => scrollToCard(i)}
            className="relative flex items-center justify-center"
          >
            <motion.div
              className="rounded-full bg-white transition-colors duration-300"
              animate={{
                width:   i === activeIdx ? 20  : 6,
                height:  6,
                opacity: i === activeIdx ? 1   : 0.28,
              }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Testimonials() {
  return (
    <section
      data-scene={SCENES.proof}
      className={`relative overflow-hidden ${SECTION_PY.lg}`}
    >
      <div className="section-divider" />

      {/* Ambient depth glows */}
      <div
        className="pointer-events-none absolute right-0 top-1/4"
        style={{
          width: 560, height: 560,
          background: 'radial-gradient(circle, rgba(37,99,235,0.045) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="pointer-events-none absolute left-0 bottom-1/4"
        style={{
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(109,40,217,0.035) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <SceneWrapper exitScale={0.97} entryY={32}>
      {/* Header — constrained to standard container */}
      <div className={CONTAINER.page}>
        <Reveal className="mb-14 text-center">
          <p className="scene-label mb-5">What teams say after 30 days</p>
          <h2
            className="mb-5 font-bold leading-[1.1] tracking-[-0.028em] text-center"
            style={{ fontSize: 'clamp(2.2rem, 4.2vw, 3.4rem)' }}
          >
            <span className={HIERARCHY.primary}>Real teams. Real outcomes.</span>
            <br />
            <span className="text-white/30">No marketing. No edits.</span>
          </h2>
          <p className={`mx-auto max-w-md text-center text-[15px] leading-relaxed mt-2 ${HIERARCHY.tertiary}`}>
            Every quote is from a real user. We didn not ask them to be kind — they just were.
          </p>
        </Reveal>
      </div>

      {/*
        Carousel is intentionally OUTSIDE the constrained container —
        it needs full viewport width to bleed edge-to-edge.
        The internal mask-image creates the cinematic reveal effect.
      */}
      <Carousel />
      </SceneWrapper>
    </section>
  );
}
