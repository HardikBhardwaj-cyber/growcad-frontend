'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Reveal from '../motion/Reveal';
import SceneWrapper from '../core/SceneWrapper';
import { useReveal } from '../hooks/useReveal';
import { useCountUp } from '../../hooks/useCountUp';
import {
  CONTAINER, SECTION_PY, SCENES,
  staggerDelay, DUR, EASE_OUT,
  HIERARCHY, SHADOW,
} from '../../systems/design';

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { target: 4200, opts: { suffix: '+',   separator: ',' }, label: 'Teams onboarded',       sub: '300+ joined in the last 30 days'  },
  { target: 99,   opts: { suffix: '.9%'                }, label: 'Uptime SLA',             sub: 'with credits if we miss it'    },
  { target: 2,    opts: { suffix: 'B+'                 }, label: 'Events tracked monthly', sub: 'without ever slowing down'     },
  { target: 12,   opts: { suffix: 'ms', prefix: 'p99 ' }, label: 'Query latency',          sub: 'fastest in the category'       },
];

const LOGOS = [
  'Vercel', 'Stripe', 'Linear', 'Notion', 'Figma',
  'Resend', 'Supabase', 'Planetscale', 'Turso', 'Neon',
];

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ target, opts, label, sub, delay = 0 }: {
  target: number;
  opts:   { suffix?: string; prefix?: string; separator?: string };
  label:  string;
  sub:    string;
  delay?: number;
}) {
  const [ref, inView] = useReveal<HTMLDivElement>({ once: true, amount: 0.3 });

  const formatted = useCountUp(target, inView, {
    duration:  1.8,
    suffix:    opts.suffix    ?? '',
    prefix:    opts.prefix    ?? '',
    separator: opts.separator ?? ',',
  });

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col items-center gap-2 text-center"
      initial={{ opacity: 0, y: 32, filter: 'blur(10px)', scale: 0.92 }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 } : {}}
      transition={{ duration: DUR.SLOW, delay, ease: EASE_OUT }}
    >
      {/* Number — scale-pop on arrival for attention lock */}
      <motion.div
        className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text font-bold leading-none tracking-tight text-transparent tabular-nums"
        style={{ fontSize: 'clamp(2.6rem, 4.5vw, 3.8rem)' }}
        animate={inView ? { scale: [0.88, 1.05, 1] } : { scale: 0.88 }}
        transition={{ duration: 0.7, delay: delay + 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {formatted}
      </motion.div>
      <p className={`text-[13.5px] font-semibold ${HIERARCHY.secondary}`}>{label}</p>
      <p className={`text-[11.5px] ${HIERARCHY.tertiary}`}>{sub}</p>
    </motion.div>
  );
}

// ─── Marquee row ──────────────────────────────────────────────────────────────
function Marquee({ logos, dir = 'left', dur = 30 }: {
  logos: string[]; dir?: 'left' | 'right'; dur?: number;
}) {
  const doubled = [...logos, ...logos];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-36 bg-gradient-to-r from-[#070709] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-36 bg-gradient-to-l from-[#070709] to-transparent" />
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: dir === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((logo, i) => (
          <span
            key={`${logo}-${i}`}
            className={`inline-flex items-center gap-2 px-7 py-3 text-[13px] font-semibold tracking-tight transition-colors duration-200 ${HIERARCHY.muted} hover:text-white/42`}
          >
            <span className="h-[3px] w-[3px] rounded-full bg-white/12" />
            {logo}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Trust() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  // Parallax the quote card slightly with scroll — adds depth
  const quoteY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      ref={sectionRef}
      data-scene={SCENES.trust}
      className={`relative ${SECTION_PY.md}`}
    >
      <div className="section-divider" />

      {/* Ambient */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2"
        style={{
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(109,40,217,0.04) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Background glow anchor — gives center heavy sections visual depth */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
        style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(109,40,217,0.055) 0%, transparent 65%)', filter: 'blur(100px)' }}
      />

      <div className={CONTAINER.page}>
      <SceneWrapper exitScale={0.97} entryY={28}>
        <Reveal className="mb-14 text-center w-full">
          <p className="scene-label mb-4 w-full text-center">Numbers that donot need a spin</p>
          <h2
            className="w-full font-bold leading-[1.08] tracking-[-0.03em] text-center"
            style={{ fontSize: 'clamp(2.2rem, 4.2vw, 3.4rem)' }}
          >
            <span className={HIERARCHY.primary}>Built for teams that ship.</span>
            <br />
            <span className="text-white/30">Proven by the teams using it.</span>
          </h2>
        </Reveal>

        {/* Stats — individually timed reveals */}
        <div className="mb-20 grid grid-cols-2 gap-x-10 gap-y-14 md:grid-cols-4">
          {STATS.map((s, i) => (
            <StatCard key={s.label} {...s} delay={staggerDelay(i, 0.06)} />
          ))}
        </div>

        {/* Trusted by header */}
        <Reveal delay={0.05} className="mb-10 text-center w-full">
          <p className={`text-[11px] font-medium uppercase tracking-[0.26em] ${HIERARCHY.muted}`}>
            The stack behind teams at
          </p>
        </Reveal>

        {/* Dual marquee — offset for depth */}
        <div className="flex flex-col gap-3">
          <Marquee logos={LOGOS}                     dir="left"  dur={30} />
          <Marquee logos={[...LOGOS].reverse()}      dir="right" dur={38} />
        </div>

        {/* Featured quote — parallax depth */}
        <Reveal delay={0.12} className="mt-20">
          <motion.div
            style={{ y: quoteY }}
            className="relative mx-auto max-w-[720px]"
          >
            {/* Outer glow */}
            <div
              className="pointer-events-none absolute -inset-4 rounded-3xl blur-2xl"
              style={{
                background: 'radial-gradient(ellipse, rgba(109,40,217,0.055) 0%, transparent 70%)',
              }}
            />
            <div
              className="relative overflow-hidden rounded-2xl border border-white/[0.07] p-10 text-center backdrop-blur-sm"
              style={{
                background: 'rgba(255,255,255,0.025)',
                boxShadow: SHADOW.card,
              }}
            >
              {/* Inner decorations */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/[0.055] via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

              {/* Quote mark — tertiary */}
              <div className="relative mb-6 font-serif text-5xl leading-none text-violet-500/30">
                &ldquo;
              </div>

              {/* Quote — secondary (this is the key message, but body-weight) */}
              <p className="relative mb-8 text-[17px] font-medium leading-[1.75] text-white/75">
                We went from gut-feel decisions to data-backed conviction in under two weeks.
                First tool we have used that actually changed how the team operates.
              </p>

              {/* Author */}
              <div className="relative flex items-center justify-center gap-4">
                <div className="relative h-11 w-11 flex-shrink-0">
                  <div className="absolute -inset-[2px] rounded-full bg-gradient-to-br from-violet-500 to-blue-500 opacity-55" />
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-[14px] font-bold text-white">
                    S
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-semibold text-white/80">Sarah Chen</p>
                  <p className={`text-[12px] ${HIERARCHY.tertiary}`}>Head of Growth, Loom</p>
                </div>
                {/* Stars */}
                <div className="ml-6 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className="text-amber-400/62 text-[13px]">★</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </SceneWrapper>
      </div>
    </section>
  );
}
