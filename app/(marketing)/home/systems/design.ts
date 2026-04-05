/**
 * Growcad Design System — Canonical tokens
 * Single source of truth for spacing, motion, color, depth.
 *
 * Motion hierarchy:
 *   MICRO    (0.2–0.35s) → button feedback, icon pops, cursor
 *   NORMAL   (0.5–0.75s) → card reveals, copy fades, tab switches
 *   CINEMATIC (1.0–1.4s) → hero entrance, scene transitions, page-level
 */

// ─── Container system ─────────────────────────────────────────────────────────
export const CONTAINER = {
  page:   'mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16',
  narrow: 'mx-auto max-w-[960px] px-6 md:px-10 lg:px-16',
  wide:   'mx-auto max-w-[1340px] px-6 md:px-10 lg:px-16',
} as const;

/** Section vertical rhythm — 80px / 120px / 160px as per spec */
export const SECTION_PY = {
  sm:     'py-20',
  md:     'py-[120px]',
  lg:     'py-[160px]',
  hero:   'pt-[7.5rem] pb-[120px]',
} as const;

// ─── Color tokens ─────────────────────────────────────────────────────────────
export const C = {
  bg:      '#070709',
  raise:   '#0c0c10',
  float:   '#111118',
  surface: 'rgba(255,255,255,0.028)',
  border:  'rgba(255,255,255,0.065)',
  borderHi:'rgba(255,255,255,0.12)',

  violet: { 300:'#c4b5fd', 400:'#a78bfa', 500:'#8b5cf6', 600:'#7c3aed', 700:'#6d28d9' },
  blue:   { 400:'#60a5fa', 500:'#3b82f6', 600:'#2563eb' },
  cyan:   { 400:'#22d3ee', 500:'#06b6d4' },
  emerald:{ 400:'#34d399', 500:'#10b981' },
  rose:   { 400:'#fb7185', 500:'#f43f5e' },
  amber:  { 400:'#fbbf24', 500:'#f59e0b' },
} as const;

// ─── Motion timing — THREE-TIER HIERARCHY ─────────────────────────────────────
export const DUR = {
  MICRO:     0.22,  // button hover, icon scale, cursor
  FAST:      0.32,  // badge pop, small feedback
  NORMAL:    0.62,  // card reveal, copy fade, tab switch
  SLOW:      0.95,  // section header, scroll entry
  CINEMATIC: 1.25,  // hero entrance, page transitions, scene cuts
  EPIC:      1.8,   // background awakening, logo reveal
} as const;

// ─── Easing curves ────────────────────────────────────────────────────────────
export const EASE_OUT     = [0.16, 1, 0.3, 1]     as const; // expo out — primary
export const EASE_SOFT    = [0.22, 1, 0.36, 1]    as const; // soft out — copy/cards
export const EASE_BACK    = [0.34, 1.56, 0.64, 1] as const; // spring overshoot — badges
export const EASE_IN      = [0.4, 0, 1, 1]        as const; // ease in — exit
export const EASE_IN_OUT  = [0.87, 0, 0.13, 1]    as const; // slow in/out — wipes

// ─── Pre-built transition objects ─────────────────────────────────────────────
export const T = {
  micro:    { duration: DUR.MICRO,     ease: EASE_OUT   },
  fast:     { duration: DUR.FAST,      ease: EASE_OUT   },
  normal:   { duration: DUR.NORMAL,    ease: EASE_SOFT  },
  slow:     { duration: DUR.SLOW,      ease: EASE_OUT   },
  cinematic:{ duration: DUR.CINEMATIC, ease: EASE_OUT   },
  epic:     { duration: DUR.EPIC,      ease: EASE_SOFT  },
  spring:        { type: 'spring' as const, damping: 26, stiffness: 200, mass: 0.5 },
  springSnappy:  { type: 'spring' as const, damping: 22, stiffness: 340, mass: 0.35 },
  springGentle:  { type: 'spring' as const, damping: 35, stiffness: 120, mass: 0.8 },
} as const;

// ─── Hero awakening — staged phase timing ─────────────────────────────────────
/**
 * "System powering up" sequence.
 * Each phase starts at these delays (seconds after page load).
 * All hero animations must reference these — no free-floating delays.
 */
export const HERO_PHASES = {
  /** Phase 0: Background/WebGL fades in */
  BG:        0.0,
  /** Phase 1: Ambient glows build */
  GLOW:      0.3,
  /** Phase 2: Badge + eyebrow appear */
  EYEBROW:   0.65,
  /** Phase 3: Headline reveals word by word */
  HEADLINE:  0.9,
  /** Phase 4: Copy + CTA appear */
  BODY:      1.35,
  /** Phase 5: Dashboard emerges from blur */
  DASHBOARD: 1.6,
  /** Phase 6: Pills + badges float in */
  PILLS:     1.9,
  /** Phase 7: Social proof settles */
  PROOF:     2.1,
  /** Phase 8: Scroll cue appears */
  SCROLL_CUE:2.8,
} as const;

// ─── Scene system (scroll narrative) ─────────────────────────────────────────
/**
 * Page scenes — data-scene attributes for each section.
 * Used by useScrollStory to orchestrate cross-section transitions.
 */
export const SCENES = {
  hero:      'scene-hero',
  value:     'scene-value',
  trust:     'scene-trust',
  product:   'scene-product',
  proof:     'scene-proof',
  pricing:   'scene-pricing',
  cta:       'scene-cta',
} as const;

// ─── Stagger helpers ──────────────────────────────────────────────────────────
/** Exponential backoff stagger — earlier items snap, later trail */
export function staggerDelay(i: number, base = 0.06): number {
  return base + i * 0.065 * Math.pow(0.92, i);
}

// ─── Depth system — "floating surfaces in space" ──────────────────────────────
export const DEPTH = {
  /** Background plane — grid, WebGL, glows */
  bg:   { zIndex: 0,  blur: 0,   scale: 1,     opacity: 1    },
  /** Mid plane — decorative blobs, scan lines */
  mid:  { zIndex: 5,  blur: 0.5, scale: 0.98,  opacity: 0.85 },
  /** Surface plane — cards, UI */
  fg:   { zIndex: 10, blur: 0,   scale: 1,     opacity: 1    },
  /** Foreground plane — floating badges, pills */
  top:  { zIndex: 20, blur: 0,   scale: 1.02,  opacity: 1    },
} as const;

/** Multi-layer shadow system — cards feel like physical objects */
export const SHADOW = {
  /** Resting card */
  card: [
    'inset 0 1px 0 rgba(255,255,255,0.055)',
    '0 1px 3px rgba(0,0,0,0.4)',
    '0 16px 40px rgba(0,0,0,0.4)',
    '0 48px 100px rgba(0,0,0,0.3)',
  ].join(', '),

  /** Hovered/lifted card */
  cardLift: [
    'inset 0 1px 0 rgba(255,255,255,0.08)',
    '0 1px 3px rgba(0,0,0,0.5)',
    '0 24px 60px rgba(0,0,0,0.55)',
    '0 80px 160px rgba(0,0,0,0.45)',
  ].join(', '),

  /** Dashboard hero card */
  dashCard: [
    'inset 0 1px 0 rgba(255,255,255,0.06)',
    '0 4px 16px rgba(0,0,0,0.5)',
    '0 32px 80px rgba(0,0,0,0.55)',
    '0 80px 160px rgba(0,0,0,0.4)',
    '0 0 0 1px rgba(255,255,255,0.04)',
  ].join(', '),

  /** Inner card reflection (top edge light) */
  innerReflect: 'inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.2)',

  glowViolet: '0 0 60px rgba(139,92,246,0.45)',
  glowBlue:   '0 0 60px rgba(59,130,246,0.35)',
  glowPulse:  '0 0 40px rgba(139,92,246,0.55), 0 0 80px rgba(139,92,246,0.2)',
} as const;

// ─── Z-index scale ────────────────────────────────────────────────────────────
export const Z = {
  bg:     0,
  mid:    5,
  fg:     10,
  float:  20,
  nav:    200,
  cursor: 9999,
  splash: 99999,
} as const;

// ─── Framer Motion Variants library ──────────────────────────────────────────
import type { Variants } from 'framer-motion';

export const V = {
  /** Standard fade + rise + blur */
  fadeUp: {
    hidden:  { opacity: 0, y: 28, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: T.normal },
  } satisfies Variants,

  /** Fast fade only */
  fadeIn: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: T.fast },
  } satisfies Variants,

  /** Scale + blur entrance — for cards */
  scaleIn: {
    hidden:  { opacity: 0, scale: 0.92, filter: 'blur(6px)' },
    visible: { opacity: 1, scale: 1,    filter: 'blur(0px)', transition: T.slow },
  } satisfies Variants,

  /** Cinematic — for hero headline words */
  word: {
    hidden:  { opacity: 0, y: 24, filter: 'blur(6px)' },
    visible: (i: number) => ({
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { duration: DUR.NORMAL, delay: i * 0.08, ease: EASE_OUT },
    }),
  } satisfies Variants,

  /** Stagger container */
  stagger: (stagger = 0.07, delay = 0.1): Variants => ({
    hidden:  {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  }),

  /** Stagger child */
  child: {
    hidden:  { opacity: 0, y: 22, filter: 'blur(5px)' },
    visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: T.normal },
  } satisfies Variants,

  /** Horizontal slide */
  slideLeft: {
    hidden:  { opacity: 0, x: 32, filter: 'blur(6px)' },
    visible: { opacity: 1, x: 0,  filter: 'blur(0px)', transition: T.normal },
  } satisfies Variants,
} as const;

// ─── Typography scale ─────────────────────────────────────────────────────────
export const TYPE = {
  display: 'clamp(3.4rem, 7vw, 5.6rem)',   // Hero
  h1:      'clamp(3rem, 5.5vw, 4.8rem)',    // Large headlines
  h2:      'clamp(2.1rem, 4.2vw, 3.2rem)', // Section headers
  h3:      'clamp(1.4rem, 2.2vw, 1.75rem)',
  body:    'clamp(0.925rem, 1.1vw, 1.05rem)',
  sm:      '0.875rem',
  xs:      '0.75rem',
} as const;

// ─── Visual hierarchy — primary vs secondary ──────────────────────────────────
export const HIERARCHY = {
  /** Primary — headline, CTA, key metric */
  primary:   'text-white',
  /** Secondary — body copy, descriptions */
  secondary: 'text-white/42',
  /** Tertiary — labels, metadata */
  tertiary:  'text-white/28',
  /** Muted — decorative, background labels */
  muted:     'text-white/18',
} as const;

// ─── Gradient helpers ─────────────────────────────────────────────────────────
export const GRAD = {
  brand:     'linear-gradient(135deg, #7c3aed, #2563eb)',
  brandSoft: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
  text:      'linear-gradient(90deg, #a78bfa, #60a5fa, #22d3ee)',
  textShort: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
  glowV:     'radial-gradient(circle, rgba(109,40,217,0.1) 0%, transparent 65%)',
  glowB:     'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 65%)',
} as const;
