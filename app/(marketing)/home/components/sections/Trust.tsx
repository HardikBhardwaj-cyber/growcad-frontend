"use client";

import { useStagger } from "../hooks/useStagger";
import GlassCard from "../ui/GlassCard";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Director, Bright Academy",
    text: "Growcad completely transformed how we manage students. Admissions, fees, and reports — everything is automated.",
  },
  {
    name: "Neha Verma",
    role: "Owner, Alpha Coaching",
    text: "The AI insights and WhatsApp automation boosted our conversions by 2x. This is not just software, it's growth engine.",
  },
  {
    name: "Amit Singh",
    role: "Founder, Success Point",
    text: "We replaced 4 different tools with Growcad. Everything is now in one place — smooth and powerful.",
  },
];

export default function Trust() {
  const ref = useStagger({ stagger: 0.2 });

  return (
    <section className="py-32 relative overflow-hidden">

      {/* 🔥 BACKGROUND LIGHT */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.15),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-8 space-y-20">

        {/* 🔥 HEADER */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold">
            Trusted by Growing Institutes
          </h2>

          <p className="text-white/60 text-lg">
            Join hundreds of coaching institutes scaling faster with Growcad.
          </p>
        </div>

        {/* 🔥 STATS */}
        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="text-3xl font-bold text-purple-400">500+</h3>
            <p className="text-white/60">Institutes</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-blue-400">1L+</h3>
            <p className="text-white/60">Students Managed</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-purple-400">99.9%</h3>
            <p className="text-white/60">Uptime</p>
          </div>
        </div>

        {/* 🔥 TESTIMONIALS */}
        <div
          ref={ref}
          className="grid md:grid-cols-3 gap-10"
        >
          {testimonials.map((t, i) => (
            <GlassCard
              key={i}
              className="p-8 space-y-5 relative overflow-hidden hover:scale-[1.03] transition-all duration-500"
            >
              {/* 🔥 QUOTE */}
              <p className="text-white/70 leading-relaxed">
                “{t.text}”
              </p>

              {/* 🔥 USER */}
              <div className="pt-4 border-t border-white/10">
                <p className="font-semibold">{t.name}</p>
                <p className="text-white/50 text-sm">{t.role}</p>
              </div>

              {/* 🔥 LIGHT HOVER */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />
            </GlassCard>
          ))}
        </div>

      </div>
    </section>
  );
}