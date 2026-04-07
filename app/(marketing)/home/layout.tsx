import type { Metadata } from 'next';
import SmoothScroll from './components/core/SmoothScroll';
import Cursor from './components/core/Cursor';
import CursorGlow from './components/effects/CursorGlow';
import GridBackground from './components/effects/GridBackground';
import NoiseLayer from './components/effects/NoiseLayer';
import TransitionOverlay from './components/core/TransitionOverlay';
import ScrollFix from './components/core/ScrollFix';
import ReducedMotionConfig from './components/core/ReducedMotionConfig';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Splash from './components/core/Splash';

export const metadata: Metadata = {
  title: 'Growcad — The Growth Stack That Never Sleeps',
  description:
    'Growcad unifies analytics, experiments, and revenue data into one intelligent workspace for modern growth teams.',
  openGraph: {
    title: 'Growcad — The Growth Stack That Never Sleeps',
    description: 'Analytics, experiments, and revenue data. One workspace.',
    type: 'website',
  },
};

/**
 * DOM stacking order (outermost = lowest, innermost JSX = rendered last):
 *
 *  ReducedMotionConfig              — React context, no DOM node
 *  ├── Splash                       — z-[99999]  fixed, pointer-events-auto (blocks on load, animates out)
 *  ├── TransitionOverlay            — z-[9998]   fixed, pointer-events-none (wipe on load, animates out)
 *  ├── Cursor                       — z-[9999]   fixed, pointer-events-none
 *  ├── CursorGlow                   — z-[8]      fixed, pointer-events-none ✓
 *  ├── GridBackground               — z-[0]      fixed, pointer-events-none ✓
 *  ├── NoiseLayer                   — z-[5]      fixed, pointer-events-none ✓
 *  ├── ScrollFix                    — null render
 *  │
 *  ├── Navbar ← OUTSIDE SmoothScroll — z-[99999] sticky, pointer-events-auto
 *  │     ┌──────────────────────────────────────────────────────────────────┐
 *  │     │  CRITICAL FIX: Navbar was previously INSIDE SmoothScroll's      │
 *  │     │  <div className="relative"> which creates a stacking context.   │
 *  │     │  A `fixed` element inside a stacking context is clipped to that  │
 *  │     │  context's z-index band. Moving Navbar here (before SmoothScroll)│
 *  │     │  puts it at the root stacking context — above everything.        │
 *  │     └──────────────────────────────────────────────────────────────────┘
 *  │
 *  └── SmoothScroll (Lenis wrapper, renders children as <>{children}</>)
 *        └── <div> (scroll content — bg-[#070709])
 *              ├── <main>{children}</main>
 *              └── <Footer />
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReducedMotionConfig>

      {/* ── z-[99999]: Splash loader ── */}
      <Splash />

      {/* ── z-[9998]: Page wipe (pointer-events-none, animates out on load) ── */}
      <TransitionOverlay />

      {/* ── z-[9999]: Custom cursor ring+dot (pointer-events-none) ── */}
      <Cursor />

      {/* ── z-[8]: Cursor ambient glow (pointer-events-none) ── */}
      <CursorGlow />

      {/* ── z-[0]: Persistent grid bg (pointer-events-none) ── */}
      <GridBackground />

      {/* ── z-[5]: Film grain (pointer-events-none) ── */}
      <NoiseLayer />

      {/* ── null render: resets scroll on route change ── */}
      <ScrollFix />

      {/*
        ── z-[99999]: NAVBAR — MUST stay here, OUTSIDE SmoothScroll ──
        Using `sticky top-0` (not fixed) because:
        1. It participates in document flow naturally
        2. No need to fight stacking contexts from transforms/filters
        3. Works correctly with Lenis smooth-scroll (Lenis operates on the
           scroll container below, not on this element)
        4. `isolation: isolate` in the component prevents ancestor filters
           from creating a new stacking context that could trap it
      */}
      <Navbar />

      {/*
        ── Lenis smooth scroll wrapper ──
        SmoothScroll renders <>{children}</> with no wrapper DOM node,
        so it introduces no stacking context. The inner <div> here IS
        a stacking context (bg + relative) but Navbar is safely outside it.
      */}
      <SmoothScroll>
        <div
          className="relative min-h-screen bg-[#070709] text-white selection:bg-violet-500/30"
          /**
           * Do NOT add transform, filter, or perspective here.
           * Those properties create a new stacking context that would
           * trap any fixed-position children below their z-index.
           */
        >
          <main>{children}</main>
          <Footer />
        </div>
      </SmoothScroll>

    </ReducedMotionConfig>
  );
}
