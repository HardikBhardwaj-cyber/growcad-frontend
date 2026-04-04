"use client";

import GlassCard from "../ui/GlassCard";
import { useStagger } from "../hooks/useStagger";
import { motion } from "framer-motion";

const features = [
  {
    title: "Fill More Batches Faster",
    desc: "Automate admissions, capture leads, and convert more students without manual follow-ups.",
    highlight: true,
  },
  {
    title: "Run Your Institute on Autopilot",
    desc: "Manage attendance, fees, results, and communication — all from one dashboard.",
  },
  {
    title: "Increase Revenue Without Extra Effort",
    desc: "Boost conversions and retention with smart automation and insights.",
  },
];

export default function Value() {
  const ref = useStagger({ stagger: 0.15 });

  return (
    <section className="py-32 relative overflow-hidden">

      {/* 🔥 BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(124,58,237,0.15),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-6 space-y-24">

        {/* 🔥 HEADER */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Everything You Need <br />
            <span className="gradient-text">
              to Grow Your Institute
            </span>
          </h2>

          <p className="text-white/60 text-lg">
            Replace manual work with automation and scale your coaching
            business without increasing workload.
          </p>
        </div>

        {/* 🔥 CARDS */}
        <div ref={ref} className="grid md:grid-cols-3 gap-10">

          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10, scale: 1.04 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard
                className={`
                  p-8 space-y-5 relative overflow-hidden
                  transition-all duration-500
                  ${f.highlight ? "border-purple-500 bg-white/10 scale-[1.03]" : ""}
                `}
              >
                {/* 🔥 ICON */}
                <div className="text-2xl">
                  {i === 0 && "🚀"}
                  {i === 1 && "⚙️"}
                  {i === 2 && "📈"}
                </div>

                {/* 🔥 TITLE */}
                <h3 className="text-xl font-semibold text-white">
                  {f.title}
                </h3>

                {/* 🔥 DESC */}
                <p className="text-white/60 leading-relaxed">
                  {f.desc}
                </p>

                {/* 🔥 HOVER LIGHT */}
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />
              </GlassCard>
            </motion.div>
          ))}

        </div>

        {/* 🔥 TRUST MINI LINE */}
        <div className="text-center text-white/40 text-sm">
          Built for coaching institutes serious about growth 🚀
        </div>

      </div>
    </section>
  );
}