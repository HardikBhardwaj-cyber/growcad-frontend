"use client";

import { ReactNode, useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { ScrollTrigger } from "@/lib/gsap";

export default function SmoothScroll({
  children,
}: {
  children: ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 🔥 INIT LENIS
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    lenisRef.current = lenis;

    // 🔥 RAF LOOP
    let rafId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      ScrollTrigger.update(); // 🔥 sync GSAP
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    // 🔥 SCROLLTRIGGER SYNC (VERY IMPORTANT)
    lenis.on("scroll", ScrollTrigger.update);

    // 🔥 FIX SCROLLTRIGGER + LENIS CONFLICT
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

    ScrollTrigger.refresh();

    // 🔥 CLEANUP
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}