"use client";

import Reveal from "../motion/Reveal";
import GlassCard from "../ui/GlassCard";

const features = [
  {
    title: "Smart Admissions",
    desc: "Automate student onboarding with AI-powered workflows.",
  },
  {
    title: "Student Management",
    desc: "Track attendance, performance, and engagement easily.",
  },
  {
    title: "Revenue Growth",
    desc: "Increase conversions with optimized funnels.",
  },
];

export default function Value() {
  return (
    <section className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6 space-y-16">

        <Reveal>
          <h2 className="text-4xl font-bold text-white text-center">
            Everything You Need to Scale
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <Reveal key={i}>
              <GlassCard className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  {f.title}
                </h3>
                <p className="text-white/70">{f.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}