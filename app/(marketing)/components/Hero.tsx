"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import FloatingCards from "./hero/FloatingCards";
import MagneticButton from "./hero/MagneticButton";
import Particles from "./hero/Particles";
import Bubbles from "./hero/Bubbles";
import Orb from "./hero/Orb";
import Stats from "./hero/Stats";
import TrustStrip from "./hero/TrustStrip";
import DashboardPreview from "./hero/DashboardPreview";

export default function Hero() {
  const router = useRouter();
  const glowRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  const scale = useTransform(scrollY, [0, 700], [1, 0.85]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const y = useTransform(scrollY, [0, 600], [0, -120]);

  // 🔥 parallax system
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const layers = document.querySelectorAll("[data-depth]");

      layers.forEach((layer) => {
        const depth = Number(layer.getAttribute("data-depth"));
        const x =
          (e.clientX / window.innerWidth - 0.5) * depth;
        const y =
          (e.clientY / window.innerHeight - 0.5) * depth;

        (layer as HTMLElement).style.transform =
          `translate(${x}px, ${y}px)`;
      });

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${e.clientX - 200}px, ${
          e.clientY - 200
        }px)`;
      }
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* 🌌 BACKGROUND SYSTEM */}
      <Particles />
      <Bubbles />

      <div className="absolute inset-0 bg-animated opacity-10" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* 🔥 DARK FOCUS */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" />

      {/* 🔥 GLOW */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute w-[400px] h-[400px] rounded-full bg-purple-600/30 blur-[140px]"
      />

      {/* 🔥 ORB (LESS INTENSE) */}
      <div data-depth="20" className="opacity-60">
        <Orb />
      </div>

      {/* 🔥 FLOATING CARDS */}
      <div data-depth="30" className="opacity-70">
        <FloatingCards />
      </div>

      {/* 🚀 MAIN CONTENT */}
      <motion.div
        style={{ scale, opacity, y }}
        className="relative z-10 text-center px-6 max-w-5xl"
      >
        {/* 🧠 HEADLINE */}
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
        >
          Run Your Institute Like a{" "}
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Top AIR Factory
          </span>
        </motion.h1>

        {/* ✨ SUBTEXT */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mt-6 text-lg md:text-xl max-w-2xl mx-auto"
        >
          Automate attendance, fees, tests, and growth — all in one platform.
        </motion.p>

        {/* 🎯 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 justify-center mt-10 flex-wrap"
        >
          <MagneticButton
            onClick={() => router.push("/auth/register")}
            primary
          >
            Start Free — No Setup Needed
          </MagneticButton>

          <MagneticButton
            onClick={() => window.open("https://youtube.com")}
          >
            See How It Works
          </MagneticButton>
        </motion.div>

        {/* 💎 TRUST */}
        <TrustStrip />

        {/* 📊 STATS */}
        <Stats />

        {/* 🧠 PRODUCT PREVIEW */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10"
        >
          <DashboardPreview />
        </motion.div>
      </motion.div>

      {/* 🔥 BOTTOM FADE */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}