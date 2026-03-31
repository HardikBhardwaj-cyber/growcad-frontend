"use client";

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
    <>
      <CursorGlow />

      <main className="relative bg-[#0a0a0f] text-white overflow-hidden">

        <GridBackground />

        <Splash />
        <Hero />
        <ComingSoon />
        <ValuePanel />
        <TrustPanel />
        <FinalCTA />

      </main>
    </>
  );
}