"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import MagneticButton from "./hero/MagneticButton";
import DashboardPreview from "./hero/DashboardPreview";
import TypingText from "./hero/TypingText";
import Spotlight from "./hero/Spotlight";
import FloatingCards from "./hero/FloatingCards";
import ComparisonToggle from "./hero/ComparisonToggle";
import WhatsAppCapture from "./hero/WhatsAppCapture";
import MiniDemo from "./hero/MiniDemo";
import { usePersona } from "./hooks/usePersona";
import { useDynamicHeadline } from "./hooks/useDynamicHeadline";

export default function Hero() {
  const { scrollY } = useScroll();

  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.7]);

  const persona = usePersona();
  const headline = useDynamicHeadline(persona);

  const ctaText: Record<typeof persona, string> = {
    small: "Start Free Trial",
    medium: "See How It Works",
    large: "Book Demo",
    default: "Get Started",
  };

  return (
    <motion.section
      style={{ scale, opacity }}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]"
    >
      {/* 🎯 LIGHT EFFECT */}
      <Spotlight />

      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-black" />

      {/* FLOATING ELEMENTS */}
      <FloatingCards />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT */}
        <div className="space-y-6">

          {/* BADGE */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
            🚀 Growth OS for Coaching Institutes
          </div>

          {/* HEADLINE */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
            {headline}
          </h1>

          {/* DYNAMIC TEXT */}
          <TypingText />

          {/* SUBTEXT */}
          <p className="text-gray-400 text-lg max-w-xl">
            From leads to admissions, fees to analytics —
            everything your institute needs to scale from
            100 to 5000+ students.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <MagneticButton label={ctaText[persona]} primary />
            <MagneticButton label="See Live Demo" />
          </div>

          {/* V5 COMPONENTS */}
          <ComparisonToggle />
          <MiniDemo />
          <WhatsAppCapture />

          {/* TRUST */}
          <div className="flex items-center gap-6 text-sm text-gray-500 pt-4">
            <span>✔ No setup cost</span>
            <span>✔ Multi-branch ready</span>
            <span>✔ Built for scale</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          <DashboardPreview />
        </div>
      </div>
    </motion.section>
  );
}