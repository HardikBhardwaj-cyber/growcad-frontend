'use client';

import type { Variants } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// CONTAINER SYSTEM — Fluid, not fixed
//
// Strategy (Linear / Vercel approach):
//   - Mobile:    full-width with fluid gutters (clamp-based)
//   - Laptop:    capped at 1200px, optically centered
//   - Desktop:   capped at 1440px — content never exceeds readable measure
//   - 2K/4K:     same 1440px cap, but root font-size scales (see globals.css)
//                so all rem-based spacing grows proportionally
//   - Ultra-wide: side margins absorb excess space, content stays premium
//
// Gutter strategy: clamp(1.5rem, 5vw, 5rem)
//   - 320px:  24px (1.5rem)
//   - 768px:  ~38px (5vw)
//   - 1200px+: 80px (5rem) ← prevents content touching container edge
// ─────────────────────────────────────────────────────────────────────────────
// ─── CONTAINER — tiered max-widths, optical centering ────────────────────────
// Breakpoint ladder (matches Tailwind screens):
//   Default (≤xl):  max-w-[1100px]   — laptop screens
//   2xl (≥1536):    max-w-[1200px]   — large laptops / 1440p
//   3xl (≥1920):    max-w-[1280px]   — 2K — content expands slightly
//   4xl (≥2560):    max-w-[1400px]   — QHD — more breathing room
//
// Gutter: clamp(1.5rem, 4vw, 2.5rem)
//   320px  → 24px   tight mobile
//   768px  → ~31px  comfortable tablet
//   1200px+→ 40px   premium desktop breathing room
//
// Why tiered (not single cap):
//   A 1200px container at 1920px feels cramped (62% viewport fill).
//   A 1280px container at 1920px feels intentional (66% viewport fill).
//   Linear and Vercel use this exact approach.
export const CONTAINER = {
  // Standard: tiered from 1100px → 1400px
  page:   'mx-auto w-full max-w-[1100px] px-[clamp(1.5rem,4vw,2.5rem)] 2xl:max-w-[1200px] 3xl:max-w-[1340px] 4xl:max-w-[1400px]',

  // Narrow: CTA, Pricing — always tighter for decision focus
  narrow: 'mx-auto w-full max-w-[840px] px-[clamp(1.5rem,4vw,2.5rem)] 2xl:max-w-[900px] 3xl:max-w-[960px]',

  // Wide: hero grid, dashboard — slightly looser
  wide:   'mx-auto w-full max-w-[1100px] px-[clamp(1.5rem,4vw,2.5rem)] 2xl:max-w-[1200px] 3xl:max-w-[1320px] 4xl:max-w-[1440px]',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION RHYTHM — Fluid vertical spacing
//
// Uses clamp() so sections breathe proportionally at every size:
//   - Mobile:    80–96px vertical padding
//   - Laptop:    120–160px
//   - 2K+:       scales via root font-size (17px at 1920px, 18px at 2560px)
// ─────────────────────────────────────────────────────────────────────────────
// ─── HERO_INNER — inner content constraint for hero (and future sections) ────
// Sits inside CONTAINER.wide, creating an optical centering layer.
// At 1920px: grid content = 1260px centred in 1340px container (40px breath each side).
export const HERO_INNER = 'mx-auto w-full max-w-[1260px]' as const;

// ─── SECTION RHYTHM — Tighter premium spacing ────────────────────────────────
// Reduced ~10% from previous — avoids "floaty SaaS" spacing problem.
// clamp(min, preferred-vw, max):
//   min  = floor on small screens
//   vw   = proportional to viewport (scales naturally)
//   max  = cap — prevents excess whitespace on large screens
export const SECTION_PY = {
  // Compact utility sections
  sm:   'py-[clamp(3.5rem,6.5vw,6rem)]',

  // Standard sections — Trust, Testimonials
  md:   'py-[clamp(4rem,7.5vw,7.5rem)]',

  // Major feature sections — Value, Dashboard, Pricing, CTA
  lg:   'py-[clamp(4rem,7.5vw,8.5rem)]',

  // Hero — navbar adds 64px via main pt; hero adds visual air
  hero: 'pt-[clamp(1.5rem,3vw,3rem)] pb-[clamp(4rem,7.5vw,8.5rem)]',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL SPACING — Fluid vertical rhythm within sections
// ─────────────────────────────────────────────────────────────────────────────
export const GAP = {
  headlineToBody: 'mb-[clamp(0.875rem,1.5vw,1.25rem)]',  // 14–20px tighter
  bodyToContent:  'mb-[clamp(1.5rem,3vw,2.5rem)]',        // 24–40px tighter
  sectionLabel:   'mb-[clamp(0.625rem,1.2vw,0.875rem)]',  // 10–14px
  labelToH2:      'mb-[clamp(0.75rem,1.5vw,1.125rem)]',   // 12–18px
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// COLOR TOKENS
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// MOTION TIMING
// ─────────────────────────────────────────────────────────────────────────────
export const DUR = {
  MICRO:      0.18,
  FAST:       0.28,
  NORMAL:     0.55,
  SLOW:       0.85,
  CINEMATIC:  1.1,
  EPIC:       1.6,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// EASING
// ─────────────────────────────────────────────────────────────────────────────
export const EASE_OUT    = [0.16, 1, 0.3, 1]     as const;
export const EASE_SOFT   = [0.22, 1, 0.36, 1]    as const;
export const EASE_BACK   = [0.34, 1.56, 0.64, 1] as const;
export const EASE_IN     = [0.4, 0, 1, 1]         as const;
export const EASE_IN_OUT = [0.87, 0, 0.13, 1]    as const;

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

// ─────────────────────────────────────────────────────────────────────────────
// HERO PHASES
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// CAROUSEL CONFIG
// ─────────────────────────────────────────────────────────────────────────────
export const CAROUSEL = {
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

// ─────────────────────────────────────────────────────────────────────────────
// SCENE SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
export const SCENES = {
  hero:    'scene-hero',
  value:   'scene-value',
  trust:   'scene-trust',
  product: 'scene-product',
  proof:   'scene-proof',
  pricing: 'scene-pricing',
  cta:     'scene-cta',
} as const;

export function staggerDelay(i: number, base = 0.06): number {
  return base + i * 0.065 * Math.pow(0.92, i);
}

// ─────────────────────────────────────────────────────────────────────────────
// Z-INDEX
// ─────────────────────────────────────────────────────────────────────────────
export const Z = {
  bg:     0,
  mid:    5,
  fg:     10,
  float:  20,
  nav:    99999,
  cursor: 99999,
  splash: 99999,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SHADOWS
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// DEPTH
// ─────────────────────────────────────────────────────────────────────────────
export const DEPTH = {
  bg:  { zIndex: 0,  blur: 0,   scale: 1,    opacity: 1    },
  mid: { zIndex: 5,  blur: 0.5, scale: 0.98, opacity: 0.85 },
  fg:  { zIndex: 10, blur: 0,   scale: 1,    opacity: 1    },
  top: { zIndex: 20, blur: 0,   scale: 1.02, opacity: 1    },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// VISUAL HIERARCHY
// ─────────────────────────────────────────────────────────────────────────────
export const HIERARCHY = {
  primary:   'text-white',
  secondary: 'text-white/52',
  tertiary:  'text-white/36',
  muted:     'text-white/22',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// TYPE SCALE — All fluid via clamp()
//
// Formula: clamp(min, preferred-vw, max)
// preferred-vw scales with viewport so text grows proportionally
// max cap prevents oversized text on 4K/8K
//
// Baseline: 16px root. At 1920px root=17px. At 2560px root=18px.
// Combined with rem values, this creates a natural fluid scale
// without JavaScript or complex calculations.
// ─────────────────────────────────────────────────────────────────────────────
// ─── TYPE SCALE — Micro-tuned for premium density ────────────────────────────
// Reduced ceilings prevent heaviness on laptop screens (1280–1440px).
// Preferred vw chosen so text feels "right" at the target design viewport (1280px):
//   headline: 4.4vw of 1280px = ~56px — reads as dominant without heavy
//   h2:       3.2vw of 1280px = ~41px — strong, not overwhelming
//   body:     1vw   of 1280px = 12.8px → clamped to 0.95rem min = 15.2px
//
// Text line length: max-w-[65ch] recommended for body blocks (see Hero, section bodies)
export const TYPE = {
  // Hero display — tightened ceiling 5.6→5.2rem
  display: 'clamp(2.8rem, 5.5vw, 5.2rem)',

  // h1 — reduced from 4.6 to 4.4rem ceiling
  h1:      'clamp(2.3rem, 4.2vw, 4.2rem)',

  // h2 — tighter ceiling 3.4→3rem, lower preferred vw
  h2:      'clamp(1.75rem, 3vw, 2.8rem)',

  // h3
  h3:      'clamp(1.2rem, 1.8vw, 1.625rem)',

  // Body — tighter window for better density
  body:    'clamp(0.95rem, 1vw, 1.05rem)',

  // Small
  sm:      'clamp(0.75rem, 0.85vw, 0.875rem)',
  xs:      'clamp(0.6875rem, 0.75vw, 0.75rem)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// GRADIENTS
// ─────────────────────────────────────────────────────────────────────────────
export const GRAD = {
  brand:     'linear-gradient(135deg, #7c3aed, #2563eb)',
  brandSoft: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
  text:      'linear-gradient(90deg, #a78bfa, #60a5fa, #22d3ee)',
  textShort: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
  glowV:     'radial-gradient(circle, rgba(109,40,217,0.1) 0%, transparent 65%)',
  glowB:     'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 65%)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FRAMER MOTION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
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
