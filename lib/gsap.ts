"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// Default settings (Pulz-level smoothness)
gsap.defaults({
  ease: "power3.out",
  duration: 1,
});

export { gsap, ScrollTrigger };