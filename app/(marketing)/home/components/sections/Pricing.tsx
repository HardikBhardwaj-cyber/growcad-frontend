"use client";

import GlassCard from "../ui/GlassCard";
import Magnetic from "../motion/Magnetic";

export default function Pricing() {
  return (
    <section className="py-32">
      <div className="max-w-6xl mx-auto px-6 text-center space-y-16">

        <h2 className="text-4xl font-bold text-white">
          Simple Pricing
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Basic */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-xl text-white">Starter</h3>
            <p className="text-white/60">₹499/month</p>
          </GlassCard>

          {/* Highlight */}
          <GlassCard className="p-8 border-purple-500 space-y-4">
            <h3 className="text-xl text-white">Growth</h3>
            <p className="text-white/60">₹999/month</p>

            <Magnetic>
              <button className="w-full py-3 bg-white text-black rounded-lg">
                Get Started
              </button>
            </Magnetic>
          </GlassCard>

          {/* Pro */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-xl text-white">Pro</h3>
            <p className="text-white/60">₹1999/month</p>
          </GlassCard>

        </div>

      </div>
    </section>
  );
}