"use client";

import { useEffect } from "react";
import SmoothScroll from "./components/core/SmoothScroll";
import PageTransition from "./components/core/PageTransition";
import TransitionOverlay from "./components/core/TransitionOverlay";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* ================= SCROLL CONTROL ================= */

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = prev;
    };
  }, []);

  /* ================= LAYOUT ================= */

  return (
    <SmoothScroll>
      {/* 🔥 ROOT LAYER */}
      <div className="relative isolate">

        {/* 🔥 TRANSITION OVERLAY (TOP MOST) */}
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <TransitionOverlay />
        </div>

        {/* 🔥 MAIN CONTENT */}
        <main className="relative z-10">
          <PageTransition>
            {children}
          </PageTransition>
        </main>

      </div>
    </SmoothScroll>
  );
}