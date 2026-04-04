"use client";

import { useStagger } from "../hooks/useStagger";
import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Director, Bright Academy",
    text: "Growcad completely transformed how we manage students. Admissions, fees, and reports — everything is automated.",
  },
  {
    name: "Neha Verma",
    role: "Owner, Alpha Coaching",
    text: "The AI insights and WhatsApp automation boosted our conversions by 2x. This is not just software, it's a growth engine.",
  },
  {
    name: "Amit Singh",
    role: "Founder, Success Point",
    text: "We replaced 4 different tools with Growcad. Everything is now in one place — smooth and powerful.",
  },
];

const stats = [
  { value: "500+", label: "Institutes" },
  { value: "1L+", label: "Students Managed" },
  { value: "99.9%", label: "Uptime" },
];

export default function Trust() {
  const ref = useStagger({ stagger: 0.15 });

  return (
    <section className="py-32 relative overflow-hidden">

      {/* 🔥 BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.15),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-6 space-y-24">

        {/* 🔥 HEADER */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold">
            Trusted by Growing Institutes
          </h2>

          <p className="text-white/60 text-lg">
            Join hundreds of coaching institutes scaling faster with Growcad.
          </p>
        </div>

        {/* 🔥 LOGO STRIP (NEW - HUGE TRUST BOOST) */}
        <div className="flex flex-wrap justify-center gap-10 text-white/30 text-sm">
          <span>Bright Academy</span>
          <span>Alpha Coaching</span>
          <span>Success Point</span>
          <span>Future Classes</span>
          <span>Excel Institute</span>
        </div>

        {/* 🔥 STATS (ANIMATED) */}
        <div className="grid md:grid-cols-3 gap-10 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <h3 className="text-3xl font-bold text-purple-400">
                {s.value}
              </h3>
              <p className="text-white/60">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* 🔥 TESTIMONIALS */}
        <div ref={ref} className="grid md:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-8 space-y-5 relative overflow-hidden">

                {/* 🔥 RATING */}
                <div className="text-yellow-400 text-sm">
                  ★ ★ ★ ★ ★
                </div>

                {/* 🔥 TEXT */}
                <p className="text-white/70 leading-relaxed">
                  “{t.text}”
                </p>

                {/* 🔥 USER */}
                <div className="pt-4 border-t border-white/10">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-white/50 text-sm">{t.role}</p>
                </div>

                {/* 🔥 HOVER LIGHT */}
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* 🔥 TRUST FOOTER LINE */}
        <div className="text-center text-white/40 text-sm">
          Rated 4.9/5 by 500+ institutes across India
        </div>

      </div>
    </section>
  );
}