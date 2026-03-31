"use client";

import { motion } from "framer-motion";
import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";
import { stagger } from "../../systems/variants";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center">

      {/* CONTENT */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center"
      >
        <HeroLeft />
        <HeroRight />
      </motion.div>
    </section>
  );
}