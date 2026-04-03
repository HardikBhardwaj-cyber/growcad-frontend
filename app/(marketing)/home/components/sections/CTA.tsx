"use client";

import Magnetic from "../motion/Magnetic";

export default function CTA() {
  return (
    <section className="py-32 text-center space-y-8">

      <h2 className="text-4xl font-bold text-white">
        Ready to Scale Your Institute?
      </h2>

      <p className="text-white/70">
        Join GrowCAD and start growing today.
      </p>

      <Magnetic>
        <button className="px-8 py-4 bg-white text-black rounded-xl">
          Start Free Trial
        </button>
      </Magnetic>

    </section>
  );
}