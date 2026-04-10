'use client';

import type { Variants } from 'framer-motion';

// ─── Container — 1200px max, px-6 mobile / px-10 desktop ──────────────────────
export const CONTAINER = {
  page:   'mx-auto w-full max-w-[1080px] px-6 md:px-10',
  narrow: 'mx-auto w-full max-w-[880px] px-6 md:px-10',
  wide:   'mx-auto w-full max-w-[1200px] px-6 md:px-10',
} as const;

// ─── Section rhythm — py-[120px] mobile / py-[160px] desktop ──────────────────
export const SECTION_PY = {
  sm:   'py-[80px] md:py-[100px]',
  md:   'py-[120px] md:py-[160px]',
  lg:   'py-[120px] md:py-[160px]',
  hero: 'pt-10 pb-[120px] md:pt-14 md:pb-[160px]',
} as const;

// ─── Internal spacing scale ───────────────────────────────────────────────────
export const GAP = {
  headlineToBody: 'mb-6',    // 24px
  bodyToContent:  'mb-12',   // 48px
  sectionLabel:   'mb-4',    // 16px
  labelToH2:      'mb-5',    // 20px
} as const;

// ─── Color tokens ─────────────────────────────────────────────────────────────
export const C = {
  bg:       '#070709',
  raise:    '#0c0c10',
  float:    '#111118',
  surface:  'rgba(255,255,255,0.028)',
  border:   'rgba(255,255,255,0.065)',
  borderHi: 'rgba(255,255,255,0.12)',
  violet:  { 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9' },
  blue:    { 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb' },
  cyan:    { 400: '#22d3ee', 500: '#06b6d4' },
  emerald: { 400: '#34d399', 500: '#10b981' },
  rose:    { 400: '#fb7185', 500: '#f43f5e' },
  amber:   { 400: '#fbbf24', 500: '#f59e0b' },
} as const;

// ─── Motion timing ────────────────────────────────────────────────────────────
export const DUR = {
  MICRO:      0.18,
  FAST:       0.28,
  NORMAL:     0.55,
  SLOW:       0.85,
  CINEMATIC:  1.1,
  EPIC:       1.6,
} as const;

// ─── Easing ───────────────────────────────────────────────────────────────────
export const EASE_OUT    = [0.16, 1, 0.3, 1]     as const;
export const EASE_SOFT   = [0.22, 1, 0.36, 1]    as const;
export const EASE_BACK   = [0.34, 1.56, 0.64, 1] as const;
export const EASE_IN     = [0.4, 0, 1, 1]         as const;
export const EASE_IN_OUT = [0.87, 0, 0.13, 1]    as const;

// ─── Transition presets ───────────────────────────────────────────────────────
export const T = {
  micro:        { duration: DUR.MICRO,     ease: EASE_OUT  },
  fast:         { duration: DUR.FAST,      ease: EASE_OUT  },
  normal:       { duration: DUR.NORMAL,    ease: EASE_SOFT },
  slow:         { duration: DUR.SLOW,      ease: EASE_OUT  },
  cinematic:    { duration: DUR.CINEMATIC, ease: EASE_OUT  },
  epic:         { duration: DUR.EPIC,      ease: EASE_SOFT },
  spring:       { type: 'spring' as const, damping: 26, stiffness: 200, mass: 0.5 },
  springSnappy: { type: 'spring' as const, damping: 22, stiffness: 340, mass: 0.35 },
  springGentle: { type: 'spring' as const, damping: 35, stiffness: 120, mass: 0.8 },
} as const;

// ─── Hero phases ──────────────────────────────────────────────────────────────
export const HERO_PHASES = {
  BG:         0.0,
  GLOW:       0.1,
  EYEBROW:    0.2,
  HEADLINE:   0.38,
  BODY:       0.55,
  DASHBOARD:  0.45,
  PILLS:      0.85,
  PROOF:      0.92,
  SCROLL_CUE: 2.0,
} as const;

// ─── Carousel config ──────────────────────────────────────────────────────────
// Enforce Apple / Linear feel: strong center dominance, depth-drop on sides
export const CAROUSEL = {
  // Carousel transitions (CSS — off React thread)
  transition: 'transform 0.48s cubic-bezier(0.16,1,0.3,1), opacity 0.48s cubic-bezier(0.16,1,0.3,1), filter 0.48s cubic-bezier(0.16,1,0.3,1), box-shadow 0.48s cubic-bezier(0.16,1,0.3,1)',
  active: {
    transform:  'scale(1) translateY(0px)',
    opacity:    1,
    filter:     'blur(0px)',
    zIndex:     10,
  },
  inactive: {
    transform:  'scale(0.88) translateY(18px)',
    opacity:    0.38,
    filter:     'blur(1.5px)',
    zIndex:     1,
  },
} as const;

// ─── Scene system ─────────────────────────────────────────────────────────────
export const SCENES = {
  hero:    'scene-hero',
  value:   'scene-value',
  trust:   'scene-trust',
  product: 'scene-product',
  proof:   'scene-proof',
  pricing: 'scene-pricing',
  cta:     'scene-cta',
} as const;

// ─── Stagger ─────────────────────────────────────────────────────────────────
export function staggerDelay(i: number, base = 0.06): number {
  return base + i * 0.065 * Math.pow(0.92, i);
}

// ─── Z-index ──────────────────────────────────────────────────────────────────
export const Z = {
  bg:     0,
  mid:    5,
  fg:     10,
  float:  20,
  nav:    99999,
  cursor: 99999,
  splash: 99999,
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const SHADOW = {
  card: [
    'inset 0 1px 0 rgba(255,255,255,0.055)',
    '0 1px 3px rgba(0,0,0,0.4)',
    '0 16px 40px rgba(0,0,0,0.4)',
    '0 48px 100px rgba(0,0,0,0.3)',
  ].join(', '),
  cardLift: [
    'inset 0 1px 0 rgba(255,255,255,0.08)',
    '0 1px 3px rgba(0,0,0,0.5)',
    '0 24px 60px rgba(0,0,0,0.55)',
    '0 80px 160px rgba(0,0,0,0.45)',
  ].join(', '),
  dashCard: [
    'inset 0 1px 0 rgba(255,255,255,0.06)',
    '0 4px 16px rgba(0,0,0,0.5)',
    '0 32px 80px rgba(0,0,0,0.55)',
    '0 80px 160px rgba(0,0,0,0.4)',
    '0 0 0 1px rgba(255,255,255,0.04)',
  ].join(', '),
  glowViolet: '0 0 60px rgba(139,92,246,0.45)',
  glowBlue:   '0 0 60px rgba(59,130,246,0.35)',
  glowPulse:  '0 0 40px rgba(139,92,246,0.55), 0 0 80px rgba(139,92,246,0.2)',
} as const;

// ─── Depth ───────────────────────────────────────────────────────────────────
export const DEPTH = {
  bg:  { zIndex: 0,  blur: 0,   scale: 1,    opacity: 1    },
  mid: { zIndex: 5,  blur: 0.5, scale: 0.98, opacity: 0.85 },
  fg:  { zIndex: 10, blur: 0,   scale: 1,    opacity: 1    },
  top: { zIndex: 20, blur: 0,   scale: 1.02, opacity: 1    },
} as const;

// ─── Visual hierarchy ─────────────────────────────────────────────────────────
export const HIERARCHY = {
  primary:   'text-white',
  secondary: 'text-white/52',
  tertiary:  'text-white/36',
  muted:     'text-white/22',
} as const;

// ─── Type scale ───────────────────────────────────────────────────────────────
export const TYPE = {
  display: 'clamp(3.4rem, 7vw, 5.6rem)',
  h1:      'clamp(3rem, 5.5vw, 4.8rem)',
  h2:      'clamp(2.2rem, 4.2vw, 3.4rem)',
  h3:      'clamp(1.4rem, 2.2vw, 1.75rem)',
  body:    'clamp(0.95rem, 1.1vw, 1.0625rem)',
  sm:      '0.875rem',
  xs:      '0.75rem',
} as const;

// ─── Gradients ────────────────────────────────────────────────────────────────
export const GRAD = {
  brand:     'linear-gradient(135deg, #7c3aed, #2563eb)',
  brandSoft: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
  text:      'linear-gradient(90deg, #a78bfa, #60a5fa, #22d3ee)',
  textShort: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
  glowV:     'radial-gradient(circle, rgba(109,40,217,0.1) 0%, transparent 65%)',
  glowB:     'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 65%)',
} as const;

// ─── Framer Motion Variants ───────────────────────────────────────────────────
export const V = {
  fadeUp: {
    hidden:  { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0,  filter: 'blur(0px)',  transition: { duration: DUR.NORMAL, ease: EASE_OUT } },
  } satisfies Variants,

  fadeIn: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: DUR.FAST, ease: EASE_OUT } },
  } satisfies Variants,

  scaleIn: {
    hidden:  { opacity: 0, scale: 0.93, filter: 'blur(8px)' },
    visible: { opacity: 1, scale: 1,    filter: 'blur(0px)', transition: { duration: DUR.SLOW, ease: EASE_OUT } },
  } satisfies Variants,

  stagger: (stagger = 0.07, delay = 0.1): Variants => ({
    hidden:  {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  }),

  child: {
    hidden:  { opacity: 0, y: 28, filter: 'blur(6px)' },
    visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: DUR.NORMAL, ease: EASE_OUT } },
  } satisfies Variants,
} as const;
