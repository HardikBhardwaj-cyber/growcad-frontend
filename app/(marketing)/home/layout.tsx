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
 * ─────────────────────────────────────────────────────────────────────────────
 * Layout architecture — fixed Navbar edition
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * DOM structure (actual browser DOM):
 *
 *   <body>
 *     ← ReducedMotionConfig renders zero DOM nodes (React context only)
 *
 *     [FIXED VIEWPORT LAYERS — paint relative to viewport, not document flow]
 *     <div.splash>         z-99999  fixed  pointer-events-auto  exits on load
 *     <div.transition>     z-9998   fixed  pointer-events-none  exits on load
 *     <div.cursor>         z-9999   fixed  pointer-events-none
 *     <div.cursor-glow>    z-8      fixed  pointer-events-none
 *     <div.grid-bg>        z-0      fixed  pointer-events-none
 *     <div.noise>          z-5      fixed  pointer-events-none
 *     (ScrollFix = null render)
 *
 *     [FIXED NAVBAR — viewport-anchored, immune to scroll container changes]
 *     <header.navbar>      z-99999  fixed  top-0 left-0 w-full
 *                          isolation:isolate  pointerEvents:auto
 *                          NO transform on this element — ever
 *
 *     [DOCUMENT FLOW — scrollable content]
 *     <div.scroll-content>   position:relative  min-height:100vh
 *                            NO overflow:hidden  NO transform  NO filter
 *       <main>               padding-top: var(--navbar-h, 64px)
 *         {children}         page sections
 *       <Footer>             always visible, never clipped
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY FIXED INSTEAD OF STICKY:
 *
 *   sticky requires every ancestor to have overflow:visible. In this stack:
 *     - Lenis intercepts wheel events on window (fine for sticky normally)
 *     - BUT: AnimatePresence (Splash exit), WebGL canvases, and backdrop-filter
 *       on multiple siblings create an environment where sticky rendering is
 *       inconsistent across browsers and React render cycles.
 *
 *   fixed is viewport-relative and immune to ALL of these:
 *     - ancestor overflow values
 *     - ancestor transforms (as long as NO ancestor has transform)
 *     - Lenis scroll interception
 *     - stacking contexts from WebGL/canvas parents
 *
 * WHY NO WRAPPER DIV AROUND NAVBAR + SCROLL-CONTENT:
 *
 *   A wrapper div would be tempting for layout clarity, but:
 *   - If it has position:relative → it becomes a containing block,
 *     but doesn't help fixed since fixed ignores all containing blocks
 *   - If it has transform → it would trap the fixed Navbar inside its
 *     stacking context (the #1 cause of fixed navbar disappearing)
 *   - Without either → it adds no value and adds a DOM node
 *
 *   Fixed Navbar + flat DOM structure is the most robust approach.
 *
 * WHY padding-top ON <main>:
 *
 *   fixed Navbar is removed from document flow. Without padding-top on
 *   main, the first section's content starts at y=0 and is hidden behind
 *   the Navbar. padding-top: var(--navbar-h, 64px) compensates exactly.
 *   The CSS variable is set by Navbar.tsx on mount via:
 *     document.documentElement.style.setProperty('--navbar-h', '64px')
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReducedMotionConfig>

      {/* ── Fixed viewport layers (z < 10000, pointer-events-none) ── */}
      <Splash />
      <TransitionOverlay />
      <Cursor />
      <CursorGlow />
      <GridBackground />
      <NoiseLayer />
      <ScrollFix />

      {/*
        Navbar — fixed, z-[99999], NO transform on the header element.
        See Navbar.tsx for full architecture notes.
        Sets --navbar-h CSS variable on <html> via useEffect on mount.
      */}
      <Navbar />

      {/*
        Scrollable content — Lenis targets window (default).
        SmoothScroll renders zero DOM nodes (<>{children}</>).
        scroll-content is the only DOM wrapper, with no stacking triggers.
      */}
      <SmoothScroll>
        <div className="scroll-content selection:bg-violet-500/30">
          {/*
            padding-top compensates for the fixed Navbar height.
            var(--navbar-h) is set by Navbar.tsx on mount.
            64px fallback handles the pre-hydration flash.
            
            DO NOT add overflow:hidden here — clips Footer and section glows.
            DO NOT add transform here — creates stacking context.
          */}
          <main style={{ paddingTop: 'var(--navbar-h, 64px)' }}>
            {children}
          </main>
          <Footer />
        </div>
      </SmoothScroll>

    </ReducedMotionConfig>
  );
}
