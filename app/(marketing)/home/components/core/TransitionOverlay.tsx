"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";

export default function TransitionOverlay() {
  const overlay = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const tl = gsap.timeline();

    tl.set(overlay.current, { y: "100%" })
      .to(overlay.current, {
        y: "0%",
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(overlay.current, {
        y: "-100%",
        duration: 0.5,
        delay: 0.2,
        ease: "power2.inOut",
      });

  }, [pathname]);

  return (
    <div
      ref={overlay}
      className="fixed inset-0 bg-black z-9999 pointer-events-none"
    />
  );
}