import Hero from "./home/components/sections/Hero";
import Value from "./home/components/sections/Value";
import Trust from "./home/components/sections/Trust";
import Pricing from "./home/components/sections/Pricing";
import CTA from "./home/components/sections/CTA";

export default function Page() {
  return (
    <main className="bg-black text-white overflow-hidden">

      {/* 🔥 HERO */}
      <Hero />

      {/* 🚀 VALUE SECTION */}
      <Value />

      {/* 🤝 TRUST */}
      <Trust />

      {/* 💰 PRICING */}
      <Pricing />

      {/* 🎯 FINAL CTA */}
      <CTA />

    </main>
  );
}