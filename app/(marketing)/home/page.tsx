"use client";

import Hero from "./components/sections/Hero";
import Value from "./components/sections/Value";
import Trust from "./components/sections/Trust";
import Pricing from "./components/sections/Pricing";
import CTA from "./components/sections/CTA";
import Splash from "./components/sections/Splash";

export default function Page() {
  return (
    <Splash>
      <main className="relative bg-[#0a0a0f] text-white overflow-hidden">

        {/* 🔥 GLOBAL DEPTH */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>

        {/* 🔥 HERO */}
        <Hero />

        {/* 🔥 TRANSITION */}
        <SectionDivider />

        {/* 🚀 VALUE */}
        <Value />

        <SectionDivider />

        {/* 🤝 TRUST */}
        <Trust />

        <SectionDivider />

        {/* 💰 PRICING */}
        <Pricing />

        <SectionDivider />

        {/* 🎯 CTA */}
        <CTA />

      </main>
    </Splash>
  );
}

/* ================= DIVIDER COMPONENT ================= */

function SectionDivider() {
  return (
    <div className="h-24 md:h-32 bg-gradient-to-b from-transparent to-white/[0.02]" />
  );
}