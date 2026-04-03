import { MotionProvider } from "./systems/MotionProvider";

import Splash from "./sections/splash/Splash";
import Hero from "./sections/hero/Hero";
// (Next we’ll add ComingSoon, Value, Trust, CTA here)

export default function Page() {
  return (
    <MotionProvider>
      {/* Splash Screen */}
      <Splash />

      {/* Main Content */}
      <main className="relative bg-black text-white overflow-hidden">
        
        {/* Hero (Scroll Story Section) */}
        <Hero />

        {/* القادمة (Next Sections will plug here) */}
        {/*
          <ComingSoon />
          <ValuePanel />
          <TrustPanel />
          <FinalCTA />
        */}

      </main>
    </MotionProvider>
  );
}