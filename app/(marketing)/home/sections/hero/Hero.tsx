"use client";

import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center">

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <HeroLeft />
        <HeroRight />
      </div>

    </section>
  );
}