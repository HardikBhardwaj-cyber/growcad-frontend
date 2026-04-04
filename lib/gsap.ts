// ❌ NO "use client"

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";

/* ================= SAFE INIT ================= */

let isGSAPInitialized = false;

export function initGSAP() {
  if (isGSAPInitialized) return;

  if (typeof window === "undefined") return;

  // 🔥 Register plugins safely
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // 🔥 Defaults (premium feel)
  gsap.defaults({
    ease: "power3.out",
    duration: 1,
  });

  // 🔥 ScrollTrigger defaults
  ScrollTrigger.defaults({
    markers: false,
    scrub: false,
  });

  // 🔥 Performance config
  gsap.config({
    force3D: true,
    nullTargetWarn: false,
  });

  isGSAPInitialized = true;
}

/* ================= EXPORT ================= */

export { gsap, ScrollTrigger };