"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import FloatingCards from "./hero/FloatingCards";
import MagneticButton from "./hero/MagneticButton";
import Orb from "./hero/Orb";

export default function Hero() {
  const router = useRouter();
  const glowRef = useRef<HTMLDivElement>(null);

  const [locked, setLocked] = useState(true);

  const { scrollY } = useScroll();

  const scale = useTransform(scrollY, [0, 700], [1, 0.7]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const y = useTransform(scrollY, [0, 600], [0, -200]);

  // 🔥 Scroll lock (attention capture)
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      document.body.style.overflow = "auto";
      setLocked(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // 🔥 Advanced parallax system
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

      {/* 🔥 Animated gradient */}
      <div className="absolute inset-0 bg-animated opacity-10" />

      {/* 🔥 Grid */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* 🔥 Dark depth */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px]" />

      {/* 🔥 Glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute w-[400px] h-[400px] rounded-full bg-purple-600/30 blur-[140px]"
      />

      {/* 🔥 Orb (deep layer) */}
      <div data-depth="20">
        <Orb />
      </div>

      {/* 🔥 Floating cards */}
      <div data-depth="40">
        <FloatingCards />
      </div>

      {/* 🔥 CONTENT */}
      <motion.div
        style={{ scale, opacity, y }}
        className="relative z-10 text-center px-6 max-w-4xl"
      >
        <motion.h1
          initial={{ opacity: 0, y: 120 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold leading-tight"
        >
          Growth OS for{" "}
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Coaching Institutes
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mt-6 text-lg md:text-xl max-w-2xl mx-auto"
        >
          Automate operations. Increase revenue. Scale like a tech company.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 text-sm text-gray-500"
        >
          Trusted by 500+ institutes • 10K+ students
        </motion.p>
      </motion.div>

      {/* 🔥 Transition fade */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}