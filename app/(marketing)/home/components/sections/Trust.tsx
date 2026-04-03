"use client";

import Reveal from "../motion/Reveal";

export default function Trust() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto text-center space-y-10">

        <Reveal>
          <p className="text-white/60 uppercase text-sm">
            Trusted by growing institutes
          </p>
        </Reveal>

        <Reveal>
          <div className="flex justify-center gap-10 opacity-60">
            <div className="w-20 h-6 bg-white/20 rounded" />
            <div className="w-20 h-6 bg-white/20 rounded" />
            <div className="w-20 h-6 bg-white/20 rounded" />
            <div className="w-20 h-6 bg-white/20 rounded" />
          </div>
        </Reveal>

      </div>
    </section>
  );
}