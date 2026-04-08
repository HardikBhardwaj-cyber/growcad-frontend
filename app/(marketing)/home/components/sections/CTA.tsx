'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Clock, Star } from 'lucide-react';
import MagneticButton from '../ui/MagneticButton';
import Button from '../ui/Button';
import { CONTAINER, SECTION_PY, SCENES, T, DUR, EASE_OUT, HERO_PHASES, SHADOW } from '../../systems/design';

// ─── Trust micro-row ──────────────────────────────────────────────────────────
const TRUST = [
  { Icon: ShieldCheck, label: 'SOC 2 Certified'   },
  { Icon: Zap,         label: 'GDPR Compliant'    },
  { Icon: Clock,       label: '99.99% Uptime'     },
  { Icon: Star,        label: 'Cancel Anytime'    },
];

export default function CTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 90%', 'center 52%'] });

  // Cinematic entry — deeper scale because this is the page's climax
  const rawScale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const rawOp    = useTransform(scrollYProgress, [0, 0.38], [0, 1]);
  const rawY     = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const scale    = useSpring(rawScale, { damping: 20, stiffness: 110 });
  const y        = useSpring(rawY,     { damping: 20, stiffness: 110 });

  return (
    <section
      ref={ref}
      data-scene={SCENES.cta}
      className={`relative overflow-hidden ${SECTION_PY.lg}`}
    >
      <div className="section-divider" />

      <div className={CONTAINER.narrow}>
        <motion.div
          style={{ scale, opacity: rawOp, y }}
          className="will-both"
        >
          {/* ── Outer animated gradient border ── */}
          <div className="relative rounded-[30px] p-[1.5px]">
            {/* Rotating gradient border ring */}
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-[30px]"
              animate={{
                background: [
                  'linear-gradient(0deg,   rgba(139,92,246,0.5) 0%, rgba(59,130,246,0.35) 33%, rgba(34,211,238,0.2)  66%, rgba(139,92,246,0.4)  100%)',
                  'linear-gradient(120deg, rgba(59,130,246,0.5) 0%, rgba(34,211,238,0.35) 33%, rgba(139,92,246,0.2)  66%, rgba(59,130,246,0.4)  100%)',
                  'linear-gradient(240deg, rgba(34,211,238,0.5) 0%, rgba(139,92,246,0.35) 33%, rgba(59,130,246,0.2)  66%, rgba(34,211,238,0.4)  100%)',
                  'linear-gradient(360deg, rgba(139,92,246,0.5) 0%, rgba(59,130,246,0.35) 33%, rgba(34,211,238,0.2)  66%, rgba(139,92,246,0.4)  100%)',
                ],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />

            {/* ── Card inner ── */}
            <div
              className="relative overflow-hidden rounded-[24px] bg-[#070810] px-8 py-16 text-center sm:px-14 sm:py-20"
              style={{ boxShadow: SHADOW.dashCard }}
            >
              {/* ── Multi-layer inner depth glows ── */}
              <div
                className="pointer-events-none absolute left-1/4 top-0 -translate-x-1/2"
                style={{
                  width: 450, height: 450,
                  background: 'radial-gradient(circle, rgba(109,40,217,0.09) 0%, transparent 68%)',
                  filter: 'blur(70px)',
                }}
              />
              <div
                className="pointer-events-none absolute right-1/4 bottom-0 translate-x-1/2"
                style={{
                  width: 420, height: 420,
                  background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 68%)',
                  filter: 'blur(70px)',
                }}
              />
              {/* Top center bloom */}
              <div
                className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
                style={{
                  width: 700, height: 200,
                  background: 'radial-gradient(ellipse, rgba(139,92,246,0.065) 0%, transparent 70%)',
                  filter: 'blur(50px)',
                }}
              />

              {/* Inner micro-grid */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[28.5px] opacity-[0.018]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),' +
                    'linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                  backgroundSize: '52px 52px',
                }}
              />

              {/* Inner top-edge reflection */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />

              {/* ── Content — timed to feel like page conclusion ── */}

              {/* Eyebrow — reinforces zero-risk */}
              <motion.div
                className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-500/22 bg-violet-500/10 px-4 py-2"
                initial={{ opacity: 0, y: 16, filter: 'blur(5px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ ...T.fast }}
              >
                <Sparkles size={12} className="text-violet-400" />
                <span className="text-[11px] font-semibold text-violet-300">
                  Join 4,200+ teams · No card required · Live in 20 min
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h2
                className="relative mb-5 font-bold leading-[1.04] tracking-[-0.038em] text-white"
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)' }}
                initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: DUR.SLOW, delay: 0.08, ease: EASE_OUT }}
              >
                Your competitors are
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  already here.
                </span>
              </motion.h2>

              {/* Sub-copy */}
              <motion.p
                className="relative mx-auto mb-8 max-w-[440px] text-[15px] leading-[1.75] text-white/58"
                initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: DUR.NORMAL, delay: 0.16, ease: EASE_OUT }}
              >
                4,200 growth teams already run on Growcad.
                Most are live in 20 minutes and see their first insight in 5.
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="relative mb-4 flex flex-col items-center justify-center gap-3 sm:flex-row"
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: DUR.NORMAL, delay: 0.24, ease: EASE_OUT }}
              >
                <MagneticButton
                  variant="primary"
                  className="!px-9 !py-[15px] !text-[14px] animate-glow-pulse"
                >
                  Start free — no setup needed <ArrowRight size={15} />
                </MagneticButton>
                <Button variant="secondary" size="lg">
                  Book a 15-min demo
                </Button>
              </motion.div>

              {/* Microcopy under CTAs */}
              <motion.p
                className="relative mb-8 text-[12.5px] text-white/42 tracking-[0.01em]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: DUR.NORMAL, delay: 0.32 }}
              >
                Setup takes 20 minutes · No engineer required · SOC 2 certified
              </motion.p>

              {/* Trust row */}
              <motion.div
                className="relative flex flex-wrap items-center justify-center gap-x-7 gap-y-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: DUR.SLOW, delay: 0.38 }}
              >
                {TRUST.map(({ Icon, label }, i) => (
                  <motion.div
                    key={label}
                    className="flex items-center gap-1.5 text-[11.5px] text-white/36"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.42 + i * 0.07, duration: DUR.FAST }}
                  >
                    <Icon size={12} className="text-white/36" />
                    {label}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
