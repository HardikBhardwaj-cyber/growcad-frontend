"use client";

import Magnetic from "../motion/Magnetic";

export default function CTA() {
  return (
    <section className="py-32 relative overflow-hidden">

      {/* 🔥 BACKGROUND LIGHT */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.25),transparent_60%)]" />

      {/* 🔥 GLOW BLOBS */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/30 blur-[120px] opacity-40 -z-10" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/30 blur-[120px] opacity-40 -z-10" />

      <div className="max-w-4xl mx-auto px-8 text-center space-y-10">

        {/* 🔥 HEADLINE */}
        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
          Ready to Scale Your Institute <br />
          <span className="gradient-text">
            Without Limits?
          </span>
        </h2>

        {/* 🔥 SUBTEXT */}
        <p className="text-white/60 text-lg">
          Join hundreds of institutes already growing with Growcad.
          Start today and experience automation, growth, and control — all in one platform.
        </p>

        {/* 🔥 CTA BUTTON */}
        <div className="flex justify-center">

          <Magnetic>
            <button className="
              px-12 py-5 text-lg font-semibold
              btn-primary
              shadow-[0_0_60px_rgba(124,58,237,0.6)]
            ">
              Start Free Trial
            </button>
          </Magnetic>

        </div>

        {/* 🔥 TRUST LINE */}
        <p className="text-white/40 text-sm">
          No credit card required • Setup in minutes
        </p>

      </div>
    </section>
  );
}