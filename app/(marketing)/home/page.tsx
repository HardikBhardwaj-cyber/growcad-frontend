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

      {/* 🔥 GLOBAL EFFECT LAYERS */}
      <CursorGlow />

      <main className="relative bg-[#0a0a0f] text-white overflow-hidden">

        {/* 🌌 BACKGROUND SYSTEM (GLOBAL) */}
        <div className="fixed inset-0 -z-50">
          <GridBackground />
        </div>

        {/* ✨ NOISE TEXTURE */}
        <div className="pointer-events-none fixed inset-0 -z-40 opacity-[0.035] mix-blend-overlay bg-[url('/noise.png')]" />

        {/* 🔥 GLOBAL LIGHT FADE (TOP) */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#0a0a0f] to-transparent z-10" />

        {/* 🔥 GLOBAL LIGHT FADE (BOTTOM) */}
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#0a0a0f] to-transparent z-10" />

        {/* 🚀 SPLASH */}
        <Splash />

        {/* 🔥 CONTENT FLOW */}
        <div className="relative z-20 flex flex-col">

          {/* 💎 HERO */}
          <section className="relative">
            <Hero />
          </section>

          {/* 🎯 COMING SOON */}
          <section className="relative">
            <ComingSoon />
          </section>

          {/* ⚡ VALUE */}
          <section className="relative">
            <ValuePanel />
          </section>

          {/* 🔐 TRUST */}
          <section className="relative">
            <TrustPanel />
          </section>

          {/* 🚀 FINAL CTA */}
          <section className="relative">
            <FinalCTA />
          </section>

        </div>

      </main>

    </MotionProvider>
  );
}