'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * SmoothScroll — Lenis wrapper
 *
 * Targets the native document scroll (window / html element).
 * This is the correct approach when:
 *   - Navbar uses position:sticky (needs window as scroll container)
 *   - Footer needs to be visible below the fold
 *   - html.lenis { height: auto } is set in globals.css
 *
 * DO NOT pass a wrapper element to Lenis.
 * A wrapper-based Lenis instance makes the wrapper element the scroll
 * container, which breaks sticky positioning for any element outside
 * the wrapper (including Navbar in layout.tsx).
 *
 * Renders children directly — zero DOM nodes added.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion — no smooth scroll for reduced motion users
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      // Target: window (default) — DO NOT set wrapper/content here.
      // Window targeting ensures position:sticky works on Navbar.
      duration:          1.35,
      easing:            (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation:       'vertical',
      gestureOrientation: 'vertical',
      smoothWheel:       true,
      wheelMultiplier:   0.85,
      touchMultiplier:   1.6,
      infinite:          false,
    });

    lenisRef.current = lenis;

    // Expose globally for GSAP ScrollTrigger integration
    window.__lenis = lenis;

    // Keep GSAP ScrollTrigger in sync on every Lenis scroll tick
    lenis.on('scroll', () => {
      const ST = window.ScrollTrigger;
        ST?.update?.();
      });  

    // RAF loop — Lenis requires its own requestAnimationFrame
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Recalculate on resize so Lenis knows the new scroll height
    const onResize = () => lenis.resize();
    window.addEventListener('resize', onResize, { passive: true });

    // Pause when tab is hidden — saves CPU
    const onVisChange = () => {
      if (document.hidden) lenis.stop();
      else lenis.start();
    };
    document.addEventListener('visibilitychange', onVisChange);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisChange);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // SmoothScroll intentionally renders zero DOM nodes.
  // Wrapping children in a div here would create a stacking context
  // and could break z-index ordering for fixed/sticky siblings.
  return <>{children}</>;
}
