"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";

export default function TransitionOverlay() {
  const overlay = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!overlay.current) return;

    // 🔥 kill previous timeline (prevents stacking)
    tlRef.current?.kill();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.inOut" },
      });

      tlRef.current = tl;

      // 🔥 start from bottom
      tl.set(overlay.current, { y: "100%" });

      // 🔥 cover screen
      tl.to(overlay.current, {
        y: "0%",
        duration: 0.6,
      });

      // 🔥 slight hold for premium feel
      tl.to(overlay.current, {
        y: "0%",
        duration: 0.15,
      });

      // 🔥 reveal next page
      tl.to(overlay.current, {
        y: "-100%",
        duration: 0.7,
      });
    }, overlay);

    return () => {
      ctx.revert();
    };
  }, [pathname]);

  return (
    <div
      ref={overlay}
      className="
        fixed inset-0 z-[9999] pointer-events-none
        bg-gradient-to-b from-black via-neutral-900 to-black
        will-change-transform
      "
    />
  );
}