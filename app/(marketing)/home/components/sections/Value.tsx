"use client";

import GlassCard from "../ui/GlassCard";
import { useStagger } from "../hooks/useStagger";

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
  const ref = useStagger({ stagger: 0.15 });

  return (
    <section className="py-32 relative">

      {/* 🔥 SOFT BACKGROUND LIGHT */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(124,58,237,0.15),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-8 space-y-20">

        {/* 🔥 HEADER */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Everything You Need <br />
            <span className="gradient-text">to Scale Faster</span>
          </h2>

          <p className="text-white/60 text-lg">
            Built for modern coaching institutes that want automation,
            growth, and control — all in one place.
          </p>
        </div>

        {/* 🔥 CARDS */}
        <div
          ref={ref}
          className="grid md:grid-cols-3 gap-10"
        >
          {features.map((f, i) => (
            <GlassCard
              key={i}
              className="
                p-8 space-y-5
                hover:scale-[1.03]
                transition-all duration-500
                relative overflow-hidden
              "
            >
              {/* 🔥 ICON GLOW */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/40 to-blue-500/40 blur-xl absolute top-4 left-4 opacity-40" />

              {/* 🔥 TITLE */}
              <h3 className="text-xl font-semibold text-white relative z-10">
                {f.title}
              </h3>

              {/* 🔥 DESC */}
              <p className="text-white/60 leading-relaxed relative z-10">
                {f.desc}
              </p>

              {/* 🔥 HOVER LIGHT */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />
            </GlassCard>
          ))}
        </div>

      </div>
    </section>
  );
}