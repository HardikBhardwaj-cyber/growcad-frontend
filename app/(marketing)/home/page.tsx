"use client";

import MotionProvider from "./systems/MotionProvider";

import CursorGlow from "./components/effects/CursorGlow";
import GridBackground from "./components/effects/GridBackground";

import Splash from "./sections/splash/Splash";
import Hero from "./sections/hero/Hero";
import ComingSoon from "./sections/coming-soon/ComingSoon";
import ValuePanel from "./sections/value/ValuePanel";
import TrustPanel from "./sections/trust/TrustPanel";
import FinalCTA from "./sections/cta/FinalCTA";

export default function HomePage() {
  return (
    <MotionProvider>

      {/* 🔥 GLOBAL EFFECT */}
      <CursorGlow />

      <main className="relative bg-[#0a0a0f] text-white overflow-hidden">

        {/* 🌌 GLOBAL BACKGROUND */}
        <div className="fixed inset-0 -z-50">
          <GridBackground />
        </div>

        {/* ✨ NOISE */}
        <div className="pointer-events-none fixed inset-0 -z-40 opacity-[0.03] mix-blend-overlay bg-[url('/noise.png')]" />

        {/* 🔥 TOP FADE */}
        <div className="pointer-events-none absolute top-0 w-full h-40 bg-gradient-to-b from-[#0a0a0f] to-transparent z-10" />

        {/* 🔥 BOTTOM FADE */}
        <div className="pointer-events-none absolute bottom-0 w-full h-40 bg-gradient-to-t from-[#0a0a0f] to-transparent z-10" />

        {/* 🚀 SPLASH */}
        <Splash />

        {/* ===================================== */}
        {/* 🔥 STORY FLOW SYSTEM STARTS HERE */}
        {/* ===================================== */}

        <div className="relative z-20">

          {/* 💎 HERO */}
          <div className="relative z-10">
            <Hero />
          </div>

          {/* 🎯 COMING SOON (OVERLAP HERO) */}
          <div className="relative z-20 -mt-[35vh]">
            <ComingSoon />
          </div>

          {/* ⚡ VALUE (STACK CONTINUITY) */}
          <div className="relative z-30 -mt-[25vh]">
            <ValuePanel />
          </div>

          {/* 🔐 TRUST */}
          <div className="relative z-40 -mt-[25vh]">
            <TrustPanel />
          </div>

          {/* 🚀 FINAL CTA */}
          <div className="relative z-50 -mt-[25vh] mb-[20vh]">
            <FinalCTA />
          </div>

        </div>

      </main>

    </MotionProvider>
  );
}