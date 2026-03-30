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
import Orb from "./hero/Orb";

export default function Hero() {
  const router = useRouter();

  const glowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  // 🔥 Scroll storytelling
  const scale = useTransform(scrollY, [0, 600], [1, 0.75]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 500], [0, -150]);

  // 🔥 Mouse movement (glow + parallax)
  useEffect(() => {
    const move = (e: MouseEvent) => {
      // Glow follow
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${e.clientX - 200}px, ${
          e.clientY - 200
        }px)`;
      }

      // Parallax layers
      const layers = document.querySelectorAll(".parallax");

      layers.forEach((layer, i) => {
        const speed = (i + 1) * 10;
        const x =
          (e.clientX / window.innerWidth - 0.5) * speed;
        const y =
          (e.clientY / window.innerHeight - 0.5) * speed;

        (layer as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* 🔥 Animated Gradient Background */}
      <div className="absolute inset-0 bg-animated opacity-10" />

      {/* 🔥 Grid */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* 🔥 Depth overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* 🔥 Mouse Glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute w-[400px] h-[400px] rounded-full bg-purple-600/30 blur-[120px] transition-transform duration-200"
      />

      {/* 🔥 Static Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-500/20 blur-[120px]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-500/20 blur-[120px]" />

      {/* 🔥 Orb */}
      <div className="parallax">
        <Orb />
      </div>

      {/* 🔥 Floating Cards */}
      <div className="parallax">
        <FloatingCards />
      </div>

      {/* 🔥 HERO CONTENT */}
      <motion.div
        ref={containerRef}
        style={{ scale, opacity, y }}
        className="relative z-10 text-center px-6 max-w-4xl transition-transform duration-200"
      >
        {/* 🔥 HEADLINE */}
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-5xl md:text-7xl font-bold leading-tight"
        >
          Growth OS for{" "}
          <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Coaching Institutes
          </span>
        </motion.h1>

        {/* 🔥 SUBTEXT */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 mt-6 text-lg md:text-xl max-w-2xl mx-auto"
        >
          Automate attendance, fees, tests, and growth — all in one platform.
        </motion.p>

        {/* 🔥 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 justify-center mt-10 flex-wrap"
        >
          <MagneticButton
            onClick={() => router.push("/auth/register")}
            primary
          >
            Start Free
          </MagneticButton>

          <MagneticButton
            onClick={() => window.open("https://youtube.com")}
          >
            Watch Demo
          </MagneticButton>
        </motion.div>

        {/* 🔥 TRUST */}
        <p className="mt-10 text-sm text-gray-500">
          Trusted by 500+ institutes • 10K+ students
        </p>
      </motion.div>

      {/* 🔥 SMOOTH TRANSITION TO NEXT SECTION */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}