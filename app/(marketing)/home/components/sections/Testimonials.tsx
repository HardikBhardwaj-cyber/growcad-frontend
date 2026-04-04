"use client";

import GlassCard from "../ui/GlassCard";
import Reveal from "../motion/Reveal";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Amit Sharma",
    role: "Director, Sharma Classes",
    text: "GrowCAD helped us increase admissions by 40% in just 3 months.",
  },
  {
    name: "Priya Classes",
    role: "Coaching Institute",
    text: "Managing students, fees, and communication is now effortless.",
  },
  {
    name: "Ravi Academy",
    role: "Owner",
    text: "Our revenue doubled after switching to GrowCAD.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-32 relative overflow-hidden">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15),transparent_60%)]" />

      <div className="max-w-6xl mx-auto px-6 text-center space-y-16">

        {/* 🔥 HEADER */}
        <Reveal>
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Loved by Institutes
            </h2>
            <p className="text-white/60">
              Trusted by coaching centers across India
            </p>
          </div>
        </Reveal>

        {/* 🔥 TESTIMONIAL GRID */}
        <div className="grid md:grid-cols-3 gap-8">

          {testimonials.map((t, i) => (
            <Reveal key={i}>
              <motion.div
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="p-6 space-y-5 relative overflow-hidden">

                  {/* 🔥 STAR RATING */}
                  <div className="flex justify-center gap-1 text-yellow-400">
                    ★ ★ ★ ★ ★
                  </div>

                  {/* 🔥 TEXT */}
                  <p className="text-white/70 leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  {/* 🔥 USER */}
                  <div className="space-y-1">
                    <h4 className="text-white font-semibold">
                      {t.name}
                    </h4>
                    <p className="text-white/40 text-sm">
                      {t.role}
                    </p>
                  </div>

                  {/* 🔥 HOVER LIGHT */}
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />

                </GlassCard>
              </motion.div>
            </Reveal>
          ))}

        </div>

        {/* 🔥 TRUST BAR */}
        <Reveal>
          <div className="flex flex-wrap justify-center gap-8 text-white/40 text-sm pt-6">
            <span>500+ Institutes</span>
            <span>1L+ Students</span>
            <span>4.9⭐ Rating</span>
          </div>
        </Reveal>

      </div>
    </section>
  );
}