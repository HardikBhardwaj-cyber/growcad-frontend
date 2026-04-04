"use client";

import Hero from "./components/sections/Hero";
import Value from "./components/sections/Value";
import Trust from "./components/sections/Trust";
import Pricing from "./components/sections/Pricing";
import CTA from "./components/sections/CTA";
import Splash from "./components/sections/Splash";

// 🔥 CORE SYSTEMS
import SmoothScroll from "./components/core/SmoothScroll";
import PageTransition from "./components/core/PageTransition";
import TransitionOverlay from "./components/core/TransitionOverlay";


export default function Page() {
  return (
    <SmoothScroll>

      {/* 🔥 SPLASH (FIRST IMPRESSION) */}
      <Splash>

        {/* 🔥 PAGE TRANSITION OVERLAY */}
        <TransitionOverlay />

        {/* 🔥 PAGE ANIMATION */}
        <PageTransition>

          <main className="relative bg-[#0a0a0f] text-white overflow-hidden">

            {/* 🔥 GLOBAL DEPTH */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.1),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.1),transparent_50%)]" />
            </div>

            {/* 🔥 HERO */}
            <Hero />

            {/* 🔥 TRANSITION */}
            <div className="h-32 bg-gradient-to-b from-transparent to-white/[0.02]" />

            {/* 🚀 VALUE */}
            <Value />

            {/* 🔥 TRANSITION */}
            <div className="h-32 bg-gradient-to-b from-transparent to-white/[0.02]" />

            {/* 🤝 TRUST */}
            <Trust />

            {/* 🔥 TRANSITION */}
            <div className="h-32 bg-gradient-to-b from-transparent to-white/[0.02]" />

            {/* 💰 PRICING */}
            <Pricing />

            {/* 🔥 TRANSITION */}
            <div className="h-32 bg-gradient-to-b from-transparent to-white/[0.02]" />

            {/* 🎯 CTA */}
            <CTA />

          </main>

        </PageTransition>

      </Splash>

    </SmoothScroll>
  );
}