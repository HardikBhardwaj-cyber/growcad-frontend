"use client";

import { useState } from "react";
import GlassCard from "../ui/GlassCard";
import Magnetic from "../motion/Magnetic";
import { useStagger } from "../hooks/useStagger";

export default function Pricing() {
  const [yearly, setYearly] = useState(true);
  const ref = useStagger({ stagger: 0.15 });

  const plans = [
    {
      name: "Basic",
      monthly: 15,
      yearly: 159,
      highlight: false,
    },
    {
      name: "Academic",
      monthly: 25,
      yearly: 269,
      highlight: true,
    },
    {
      name: "Advanced",
      monthly: 99,
      yearly: 899,
      highlight: false,
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden">

      {/* 🔥 BACKGROUND LIGHT */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.2),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-8 space-y-20 text-center">

        {/* 🔥 HEADER */}
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            Simple, Scalable Pricing
          </h2>

          <p className="text-white/60 text-lg">
            Pay per student. Scale as your institute grows.
          </p>
        </div>

        {/* 🔥 TOGGLE */}
        <div className="flex justify-center items-center gap-4">

          <span className={!yearly ? "text-white" : "text-white/40"}>
            Monthly
          </span>

          <button
            onClick={() => setYearly(!yearly)}
            className="relative w-16 h-9 bg-white/10 rounded-full border border-white/10"
          >
            <div
              className={`
                absolute top-1 left-1 w-7 h-7 rounded-full bg-white
                transition-transform duration-300
                ${yearly ? "translate-x-7" : ""}
              `}
            />
          </button>

          <span className={yearly ? "text-white" : "text-white/40"}>
            Yearly
          </span>

          <span className="text-xs text-purple-400 ml-2">
            Save ~20%
          </span>
        </div>

        {/* 🔥 PRICING CARDS */}
        <div ref={ref} className="grid md:grid-cols-3 gap-10">

          {plans.map((plan, i) => {
            const price = yearly ? plan.yearly : plan.monthly;

            return (
              <GlassCard
                key={i}
                className={`
                  p-8 space-y-6 relative overflow-hidden
                  transition-all duration-500
                  hover:scale-[1.04]
                  ${plan.highlight ? "scale-105 border-purple-500" : ""}
                `}
              >
                {/* 🔥 POPULAR BADGE */}
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-xs px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                {/* 🔥 PLAN NAME */}
                <h3 className="text-xl font-semibold">{plan.name}</h3>

                {/* 🔥 PRICE */}
                <div className="text-5xl font-bold">
                  ₹{price}
                  <span className="text-sm text-white/50">
                    {" "}
                    /student
                  </span>
                </div>

                {/* 🔥 BUFFER USP */}
                {yearly && (
                  <p className="text-green-400 text-sm">
                    Includes 10% FREE student buffer
                  </p>
                )}

                {/* 🔥 DESCRIPTION */}
                <p className="text-white/60 text-sm">
                  Built for modern coaching institutes
                </p>

                {/* 🔥 CTA */}
                <Magnetic>
                  <button className="w-full py-3 btn-primary text-lg">
                    Get Started
                  </button>
                </Magnetic>

                {/* 🔥 HOVER LIGHT */}
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />
              </GlassCard>
            );
          })}

        </div>

        {/* 🔥 IMPLEMENTATION */}
        <div className="text-white/50 text-sm space-y-2">
          <p>
            One-time onboarding & setup based on institute size
          </p>
          <p className="text-white/40">
            Starts from ₹4,999 (up to 250 students)
          </p>
        </div>

        {/* 🔥 OFFER */}
        <div className="text-purple-400 text-sm">
          🎉 50% OFF for additional institutes
        </div>

      </div>
    </section>
  );
}