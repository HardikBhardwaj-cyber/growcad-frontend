"use client";

import { ReactNode, useEffect, useRef } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "@/lib/gsap";

export default function SmoothScroll({
  children,
}: {
  children: ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // 🔥 prevent double init (strict mode safe)
    if (lenisRef.current) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      lerp: 0.08,
    });

    lenisRef.current = lenis;

    // 🔥 RAF LOOP (SINGLE SOURCE OF TRUTH)
    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);

    // 🔥 SYNC GSAP (ONLY ONE METHOD)
    lenis.on("scroll", ScrollTrigger.update);

    // 🔥 PROPER SCROLLER PROXY
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value as number, { immediate: true });
        }
        return lenis.scroll;
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

    // 🔥 REFRESH HANDLING
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    ScrollTrigger.addEventListener("refresh", () => lenis.resize());
    ScrollTrigger.refresh();

    // 🔥 CLEANUP
    return () => {
      window.removeEventListener("resize", handleResize);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}