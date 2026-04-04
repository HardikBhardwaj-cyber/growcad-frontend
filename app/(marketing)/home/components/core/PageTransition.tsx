"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!container.current || !overlay.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 🔥 STEP 1 — EXIT (overlay slides in)
      tl.set(overlay.current, { y: "100%" });

      tl.to(overlay.current, {
        y: "0%",
        duration: 0.6,
        ease: "power4.inOut",
      });

      // 🔥 STEP 2 — RESET CONTENT
      tl.set(container.current, {
        opacity: 0,
        y: 40,
        filter: "blur(10px)",
      });

      // 🔥 STEP 3 — ENTER (overlay slides out)
      tl.to(overlay.current, {
        y: "-100%",
        duration: 0.6,
        ease: "power4.inOut",
      });

      // 🔥 STEP 4 — CONTENT FADE IN
      tl.to(
        container.current,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.4"
      );
    }, container);

    return () => ctx.revert();
  }, [pathname]);

  return (
    <>
      {/* 🔥 TRANSITION OVERLAY */}
      <div
        ref={overlay}
        className="fixed inset-0 z-[9997] bg-black pointer-events-none"
      />

      {/* 🔥 PAGE CONTENT */}
      <div ref={container}>{children}</div>
    </>
  );
}