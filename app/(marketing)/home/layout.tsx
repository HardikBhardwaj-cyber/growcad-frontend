"use client";

import SmoothScroll from "./components/core/SmoothScroll";
import PageTransition from "./components/core/PageTransition";
import TransitionOverlay from "./components/core/TransitionOverlay";
import { useEffect } from "react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // 🔥 Prevent scroll jump during transitions
  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  return (
    <SmoothScroll>
      
      {/* 🔥 PAGE TRANSITION OVERLAY (TOP LAYER) */}
      <div className="fixed inset-0 z-9998 pointer-events-none">
        <TransitionOverlay />
      </div>

      {/* 🔥 MAIN CONTENT TRANSITIONS */}
      <div className="relative z-10 will-change-transform">
        <PageTransition>
          {children}
        </PageTransition>
      </div>

    </SmoothScroll>
  );
}