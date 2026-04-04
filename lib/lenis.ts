// ❌ NO "use client"

import Lenis from "@studio-freight/lenis";
import { ScrollTrigger } from "@/lib/gsap";

/* ================= SINGLETON ================= */

let lenis: Lenis | null = null;
let rafId: number | null = null;
let isInitialized = false;

/* ================= INIT ================= */

export function initLenis() {
  if (isInitialized) return;
  if (typeof window === "undefined") return;

  lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1,
    lerp: 0.08,
  });

  /* 🔥 RAF LOOP (ULTRA IMPORTANT) */
  const raf = (time: number) => {
    lenis?.raf(time);
    ScrollTrigger.update(); // 🔥 GSAP sync
    rafId = requestAnimationFrame(raf);
  };

  rafId = requestAnimationFrame(raf);

  /* 🔥 SCROLLTRIGGER SYNC */
  lenis.on("scroll", ScrollTrigger.update);

  /* 🔥 SCROLLER PROXY (CRITICAL) */
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length && lenis) {
        lenis.scrollTo(value as number);
      }
      return window.scrollY;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  /* 🔥 REFRESH */
  ScrollTrigger.refresh();

  isInitialized = true;
}

/* ================= DESTROY ================= */

export function destroyLenis() {
  if (!lenis) return;

  lenis.destroy();
  lenis = null;

  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  isInitialized = false;
}

/* ================= ACCESS ================= */

export function getLenis() {
  return lenis;
}