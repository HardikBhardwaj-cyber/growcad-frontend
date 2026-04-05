'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MotionValue } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import Reveal from '../motion/Reveal';
import {
  CONTAINER, SECTION_PY, SCENES,
  T, staggerDelay, DUR, EASE_OUT,
  HIERARCHY, SHADOW,
} from '../../systems/design';

// ─── Data ─────────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "We replaced four separate tools with Growcad. Our data is finally a source of truth, not a source of endless arguments.",
    name: 'Marcus Liu', role: 'VP of Product', co: 'Fathom',
    color: '#7c3aed', span: 'md:col-span-2', stars: 5,
  },
  {
    quote: "The experiment engine alone is worth the price. We shipped 60 A/B tests in Q1. We used to do six a quarter.",
    name: 'Priya Nair', role: 'Growth Lead', co: 'Render',
    color: '#2563eb', span: '', stars: 5,
  },
  {
    quote: "Onboarding took 20 minutes. The first insight took 5. I've never felt that fast with a data tool.",
    name: 'Tom Briggs', role: 'Head of Ops', co: 'Railway',
    color: '#059669', span: '', stars: 5,
  },
  {
    quote: "The AI summaries are scary good. It caught a 15% activation drop we'd have missed for weeks.",
    name: 'Yuki Tanaka', role: 'Data Engineer', co: 'Trigger.dev',
    color: '#dc2626', span: '', stars: 5,
  },
  {
    quote: "Best DX in the analytics space, bar none. The SDK is clean, APIs are predictable, and the docs actually work.",
    name: 'Alex Mercer', role: 'Senior Engineer', co: 'Unkey',
    color: '#d97706', span: 'md:col-span-2', stars: 5,
  },
  {
    quote: "Switched from Mixpanel + Amplitude + Heap. I'm not going back. Ever.",
    name: 'Sofia Mendez', role: 'CEO', co: 'Loops',
    color: '#7c3aed', span: '', stars: 5,
  },
];

// ─── Card ─────────────────────────────────────────────────────────────────────
function TestimonialCard({
  t, i, scrollProgress,
}: {
  t: typeof TESTIMONIALS[0];
  i: number;
  scrollProgress: MotionValue<number>;
}) {
  // Each card gets a slight parallax offset based on its index
  // — later cards move at slightly different speeds, creating depth
  const offset   = (i % 3) * 8; // 0, 8, or 16px
  const cardY    = useTransform(scrollProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div
      className={t.span}
      style={{ y: cardY }}
      initial={{ opacity: 0, y: 36, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: DUR.SLOW + i * 0.03,
        delay: staggerDelay(i, 0.06),
        ease: EASE_OUT,
      }}
    >
      <GlassCard
        glow
        glowColor={`${t.color}20`}
        className="group h-full cursor-default"
      >
        {/* Per-card color tint on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{ background: `linear-gradient(135deg, ${t.color}0d, transparent 55%)` }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={T.fast}
        />

        {/* Header: quote mark + stars */}
        <div className="mb-4 flex items-start justify-between">
          {/* Quote mark — decorative (muted) */}
          <motion.div
            className={`font-serif text-[34px] leading-none ${HIERARCHY.muted}`}
            whileHover={{ scale: 1.2 }}
            transition={T.micro}
          >
            &ldquo;
          </motion.div>

          {/* Stars — appear with spring stagger on scroll enter */}
          <div className="flex gap-0.5">
            {Array.from({ length: t.stars }).map((_, si) => (
              <motion.span
                key={si}
                className="text-amber-400/62 text-[11px]"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: staggerDelay(si, 0.32) + i * 0.035,
                  duration: 0.28,
                  ease: [0.34, 1.56, 0.64, 1], // back ease — slight bounce
                }}
              >
                ★
              </motion.span>
            ))}
          </div>
        </div>

        {/* Quote — secondary (body weight, not headline weight) */}
        <p className={`mb-6 text-[13.5px] leading-[1.72] ${HIERARCHY.secondary}`}>
          {t.quote}
        </p>

        {/* Author — tertiary */}
        <div className="mt-auto flex items-center gap-3">
          <div
            className="relative h-9 w-9 flex-shrink-0 rounded-full flex items-center justify-center text-[12px] font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${t.color}ee, ${t.color}66)`,
              boxShadow: `0 0 0 2px ${t.color}30`,
            }}
          >
            {t.name[0]}
          </div>
          <div>
            <p className={`text-[13px] font-semibold ${HIERARCHY.secondary}`}>{t.name}</p>
            <p className={`text-[11px] ${HIERARCHY.tertiary}`}>{t.role} · {t.co}</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section
      ref={sectionRef}
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

      <div className={CONTAINER.page}>
        {/* Scene label + header — visual hierarchy */}
        <Reveal className="mb-16 text-center">
          <p className="scene-label mb-4">From the community</p>
          <h2
            className="mb-4 font-bold leading-[1.1] tracking-[-0.028em]"
            style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.2rem)' }}
          >
            <span className={HIERARCHY.primary}>Builders who switched</span>
            <br />
            <span className="text-white/26">never look back.</span>
          </h2>
          <p className={`mx-auto max-w-md text-[15px] leading-relaxed ${HIERARCHY.tertiary}`}>
            Real teams. Real results. No cherry-picking.
          </p>
        </Reveal>

        {/* Grid — gap-5 for breathing room */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard
              key={t.name}
              t={t}
              i={i}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
