"use client";

import { useEffect, useRef } from "react";
import Magnetic from "../motion/Magnetic";

export default function Navbar() {
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;

      if (window.scrollY > 20) {
        headerRef.current.classList.add(
          "backdrop-blur-xl",
          "bg-black/50",
          "border-b",
          "border-white/10"
        );
      } else {
        headerRef.current.classList.remove(
          "backdrop-blur-xl",
          "bg-black/50",
          "border-b",
          "border-white/10"
        );
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className="
        fixed top-0 left-0 w-full z-[999]
        transition-all duration-300
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* 🔥 LOGO */}
        <h1 className="font-bold text-lg tracking-wide cursor-pointer">
          GROWCAD
        </h1>

        {/* 🔥 NAV */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <a className="hover:text-white transition">Features</a>
          <a className="hover:text-white transition">Pricing</a>
          <a className="hover:text-white transition">Contact</a>
        </nav>

        {/* 🔥 CTA */}
        <Magnetic>
          <button
            className="
              px-5 py-2.5
              bg-white text-black
              rounded-xl font-medium
              transition-all duration-300
              hover:scale-105
              hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]
            "
          >
            Get Started
          </button>
        </Magnetic>

      </div>
    </header>
  );
}