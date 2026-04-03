"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";
import GridBackground from "../../components/effects/GridBackground";
import CursorGlow from "../../components/effects/CursorGlow";

export default function Hero() {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
  });

  /* ---------------- STORY PHASES ---------------- */

  // Phase 1 → Normal
  // Phase 2 → Fade left
  // Phase 3 → Focus on dashboard

  const leftOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const leftY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  const rightScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const rightY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const overlayOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);

  return (
    <section ref={ref} className="relative h-[200vh] bg-black">

      {/* Sticky Viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Background */}
        <GridBackground />
        <CursorGlow />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-16 h-full flex items-center">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">

            {/* LEFT STORY */}
            <motion.div
              style={{ opacity: leftOpacity, y: leftY }}
              className="lg:col-span-5 flex justify-center lg:justify-start"
            >
              <HeroLeft />
            </motion.div>

            {/* RIGHT STORY */}
            <motion.div
              style={{ scale: rightScale, y: rightY }}
              className="lg:col-span-7 flex justify-center"
            >
              <HeroRight />
            </motion.div>

          </div>
        </div>

        {/* STORY OVERLAY (Phase 2) */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 flex items-center justify-center text-center px-6"
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-semibold text-white leading-tight">
              Run your entire institute
              <br />
              from one powerful system
            </h2>

            <p className="text-neutral-400 mt-4 text-lg">
              Admissions, students, payments, analytics — everything unified.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}