"use client";

import { useEffect, useState } from "react";
import Magnetic from "../motion/Magnetic";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-999
        transition-all duration-300
        ${scrolled ? "backdrop-blur-xl bg-black/40 border-b border-white/10" : ""}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <h1 className="font-bold text-lg tracking-wide">
          GROWCAD
        </h1>

        {/* NAV LINKS */}
        <nav className="hidden md:flex gap-8 text-sm text-white/70">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Contact</a>
        </nav>

        {/* CTA */}
        <Magnetic>
          <button className="px-5 py-2 bg-white text-black rounded-lg font-medium">
            Get Started
          </button>
        </Magnetic>

      </div>
    </header>
  );
}