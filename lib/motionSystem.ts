// lib/motionSystem.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single motion system shared by every page.
// Framer Motion is the primary engine; anime.js is scoped to the hero
// timeline only — lazy-loaded, zero bundle impact on other pages.
//
// RULES
//   1. Components import from here — never inline ease arrays or durations.
//   2. Anime.js is imported only inside loadAnimeTimeline (dynamic, client-only).
//   3. All motion uses transform + opacity only (GPU-composited, no layout props).
//   4. Springs are preferred over duration tweens for interactive responses.
// ─────────────────────────────────────────────────────────────────────────────

import type { Variants, Transition, TargetAndTransition } from 'framer-motion';

// ─── Durations (seconds) ──────────────────────────────────────────────────────
export const DUR = {
  MICRO:     0.12,  // press feedback, focus ring
  FAST:      0.22,  // hover state, small reveal
  NORMAL:    0.46,  // standard reveal
  SLOW:      0.72,  // hero elements, large reveals
  CINEMATIC: 1.05,  // dashboard entry, page hero
} as const;

// ─── Cubic bezier easings ─────────────────────────────────────────────────────
export const EASE = {
  /** Expo-out: fast start, smooth settle. Primary curve for almost everything. */
  out:   [0.16, 1, 0.3, 1]      as const,
  /** Gentle deceleration. Cards, section reveals, content-heavy elements. */
  soft:  [0.22, 1, 0.36, 1]    as const,
  /** Overshoot + settle. Confirmations, badges, success states. */
  back:  [0.34, 1.56, 0.64, 1] as const,
  /** Acceleration. Exits only — elements leaving the screen. */
  in:    [0.4, 0, 1, 1]        as const,
  /** S-curve. Mode transitions, tab switches. */
  inOut: [0.87, 0, 0.13, 1]    as const,
} as const;

// ─── Spring configs ───────────────────────────────────────────────────────────
export const SPRING = {
  /** Immediate. Button press, small pointer feedback. */
  snappy: { type: 'spring', stiffness: 580, damping: 32, mass: 0.45 } as const,
  /** Balanced. Card hover, menu open. */
  normal: { type: 'spring', stiffness: 320, damping: 28, mass: 0.55 } as const,
  /** Gentle float. Dashboard preview, floating cards. */
  soft:   { type: 'spring', stiffness: 160, damping: 26, mass: 0.8  } as const,
} as const;

// ─── Reusable transition objects ──────────────────────────────────────────────
export const T = {
  micro:    { duration: DUR.MICRO,     ease: EASE.out  } as Transition,
  fast:     { duration: DUR.FAST,      ease: EASE.out  } as Transition,
  normal:   { duration: DUR.NORMAL,    ease: EASE.soft } as Transition,
  slow:     { duration: DUR.SLOW,      ease: EASE.out  } as Transition,
  cinematic:{ duration: DUR.CINEMATIC, ease: EASE.out  } as Transition,
  spring:   SPRING.normal as Transition,
} as const;

// ─── Framer Motion variant presets ────────────────────────────────────────────

/** Standard entrance for any UI element */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 32, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)',
    transition: { duration: DUR.NORMAL, ease: EASE.out } },
};

/** Pure opacity. Backgrounds, overlays. */
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.FAST, ease: EASE.out } },
};

/** Modals, popups, cards entering. */
export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.92, filter: 'blur(6px)' },
  visible: { opacity: 1, scale: 1,    filter: 'blur(0px)',
    transition: { duration: DUR.SLOW, ease: EASE.out } },
};

/** Modal close. */
export const scaleOut: Variants = {
  hidden:  { opacity: 1, scale: 1 },
  visible: { opacity: 0, scale: 0.94,
    transition: { duration: DUR.FAST, ease: EASE.in } },
};

/** Page transitions, drawers — enter from right. */
export const slideInRight: Variants = {
  hidden:  { opacity: 0, x: 40,  filter: 'blur(6px)' },
  visible: { opacity: 1, x: 0,   filter: 'blur(0px)',
    transition: { duration: DUR.NORMAL, ease: EASE.out } },
};

/** Page transitions — exit to left. */
export const slideOutLeft: Variants = {
  hidden:  { opacity: 1, x: 0  },
  visible: { opacity: 0, x: -28,
    transition: { duration: DUR.FAST, ease: EASE.in } },
};

/** Parent container for stagger groups. Children use staggerChild. */
export const staggerContainer = (
  stagger = 0.07,
  delayChildren = 0.08,
): Variants => ({
  hidden:  {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Pairs with staggerContainer. */
export const staggerChild: Variants = {
  hidden:  { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)',
    transition: { duration: DUR.NORMAL, ease: EASE.out } },
};

// ─── Card interaction (whileHover / whileTap) ─────────────────────────────────
export const CARD_HOVER: TargetAndTransition = {
  scale:      1.022,
  y:          -4,
  transition: { ...SPRING.normal },
};

export const CARD_TAP: TargetAndTransition = {
  scale:      0.975,
  transition: { ...SPRING.snappy },
};

// ─── Page transitions ─────────────────────────────────────────────────────────
export const PAGE_ENTER: Variants = {
  hidden:  { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)',
    transition: { duration: DUR.NORMAL, ease: EASE.soft } },
};

export const PAGE_EXIT: Variants = {
  hidden:  { opacity: 1, y: 0  },
  visible: { opacity: 0, y: -10,
    transition: { duration: DUR.FAST, ease: EASE.in } },
};

// ─── Modal variants ───────────────────────────────────────────────────────────
export const MODAL_BACKDROP: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.FAST } },
};

export const MODAL_PANEL: Variants = {
  hidden:  { opacity: 0, scale: 0.94, y: 16, filter: 'blur(8px)' },
  visible: { opacity: 1, scale: 1,    y: 0,  filter: 'blur(0px)',
    transition: { duration: DUR.SLOW, ease: EASE.out } },
};

export const MODAL_EXIT: Variants = {
  visible: {},
  hidden:  { opacity: 0, scale: 0.96, y: 8,
    transition: { duration: DUR.FAST, ease: EASE.in } },
};

// ─── Hero phase delays (seconds from page load) ───────────────────────────────
// Cascade: badge → headline → subtext → cta → dashboard → pills → proof
// Each element starts after the previous reaches ~70% of its travel.
export const HERO_PHASES = {
  BADGE:      0.10,
  HEADLINE:   0.24,
  SUBTEXT:    0.40,
  CTA:        0.52,
  MICROCOPY:  0.58,
  PROOF:      0.66,
  DASHBOARD:  0.40,  // parallel with headline — enters as user reads
  PILLS:      0.80,
  SCROLL_CUE: 2.00,
} as const;

// ─── Anime.js v4 hero timeline (lazy — client-only) ───────────────────────────
//
// IMPORTANT: This function must only be called inside useEffect or an
// equivalent client-only boundary — never at module scope or during SSR.
//
// Anime.js v4 API differences from v3 (both breaking):
//   v3: import anime from 'animejs'             (default export)
//   v4: import { createTimeline } from 'animejs' (named exports only)
//
//   v3: anime.timeline({ easing, duration })
//   v4: createTimeline({ defaults: { ease, duration } })
//       Note: key is `ease` not `easing`, and `defaults` wraps the params.
//
//   v3: .add({ targets, translateY: [16, 0], duration }, '-=280')
//   v4: .add(targets, { translateY: ['16px', '0px'], duration }, '-=280')
//       Note: targets is first arg; props are second; offset is third.
//             translateY values must be CSS strings, not plain numbers.
//
// The AnimeTimelineRunner interface is exported so Hero.tsx is type-safe
// without importing animejs at the module level — keeping anime out of
// the SSR bundle and the primary JS chunk entirely.

export interface AnimeTimelineRunner {
  runHeroTimeline: (badge: string, headline: string, sub: string, cta: string) => void;
}

export async function loadAnimeTimeline(): Promise<AnimeTimelineRunner> {
  // Guard: never run on the server — document is undefined in Node.js
  if (typeof document === 'undefined') {
    throw new Error('loadAnimeTimeline must only be called in a browser environment.');
  }

  // Named destructure — v4 has NO default export
  const { createTimeline } = await import('animejs');

  return {
    runHeroTimeline(badge, headline, sub, cta) {
      // Reset each element to its initial (hidden) state before anime drives it.
      // This prevents a flash of visible content before the timeline starts,
      // and ensures Framer Motion's fallback initial values don't conflict.
      const selectors = [badge, headline, sub, cta];
      for (const sel of selectors) {
        const el = document.querySelector<HTMLElement>(sel);
        if (el) {
          el.style.opacity   = '0';
          el.style.transform = 'translateY(24px)';
        }
      }

      // v4: createTimeline() takes a defaults object.
      // 'outExpo' is a built-in easing name in v4 that matches
      // cubicBezier(0.16, 1, 0.3, 1) — our standard EASE.out curve.
      // Using the named string avoids inlining the array here.
      createTimeline({
        defaults: {
          ease:     'outExpo',
          duration: 560,
        },
      })
        // v4: .add(targets, properties, timelineOffset?)
        // translateY values must be CSS length strings in v4, not plain numbers.
        // Offsets ('-=N') work the same as v3.
        .add(badge,    { opacity: [0, 1], translateY: ['16px', '0px'] }, 0)
        .add(headline, { opacity: [0, 1], translateY: ['28px', '0px'], duration: 520 }, '-=280')
        .add(sub,      { opacity: [0, 1], translateY: ['16px', '0px'], duration: 420 }, '-=320')
        .add(cta,      { opacity: [0, 1], translateY: ['14px', '0px'], duration: 380 }, '-=300');
    },
  };
}
