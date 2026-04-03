"use client";

import GlassCard from "../ui/GlassCard";
import Reveal from "../motion/Reveal";

const testimonials = [
  {
    name: "Amit Sharma",
    text: "GrowCAD helped us increase admissions by 40% in 3 months.",
  },
  {
    name: "Priya Classes",
    text: "Managing students is now effortless. Best decision ever.",
  },
  {
    name: "Ravi Academy",
    text: "Our revenue doubled after switching to GrowCAD.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-32">
      <div className="max-w-6xl mx-auto px-6 text-center space-y-16">

        <Reveal>
          <h2 className="text-4xl font-bold text-white">
            Loved by Institutes
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Reveal key={i}>
              <GlassCard className="p-6 space-y-4">
                <p className="text-white/70">
                    &ldquo;{t.text}&rdquo;
                </p>
                <h4 className="text-white font-semibold">{t.name}</h4>
              </GlassCard>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}