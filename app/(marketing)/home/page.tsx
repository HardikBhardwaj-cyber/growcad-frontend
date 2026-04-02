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

      {/* 🔥 CURSOR LAYER */}
      <CursorGlow />

      {/* 🔥 MAIN ROOT */}
      <main className="relative bg-[#0a0a0f] text-white overflow-hidden">

        {/* 🌌 BACKGROUND SYSTEM */}
        <GridBackground />

        {/* ✨ NOISE TEXTURE (PREMIUM TOUCH) */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('/noise.png')]" />

        {/* 🚀 SPLASH */}
        <Splash />

        {/* 💎 HERO */}
        <Hero />

        {/* 🎯 COMING SOON */}
        <ComingSoon />

        {/* ⚡ VALUE */}
        <ValuePanel />

        {/* 🔐 TRUST */}
        <TrustPanel />

        {/* 🚀 FINAL CTA */}
        <FinalCTA />

      </main>

    </MotionProvider>
  );
}