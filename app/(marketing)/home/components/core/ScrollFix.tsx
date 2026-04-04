"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initLenis, getLenis } from "@/lib/lenis";

export default function ScrollFix() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const html = document.documentElement;
    const original = html.style.scrollBehavior;

    html.style.scrollBehavior = "auto";

    // 🔥 ensure lenis initialized
    initLenis();

    const lenis = getLenis();

    // 🔥 safe scroll reset
    lenis?.scrollTo(0, { immediate: true });

    return () => {
      html.style.scrollBehavior = original;
    };
  }, [pathname]);

  return null;
}