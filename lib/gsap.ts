// ❌ NO "use client" here

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";

// 🔥 Safe plugin registration
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// 🔥 Default animation config (premium feel)
gsap.defaults({
  ease: "power3.out",
  duration: 1,
});

// 🔥 Better ScrollTrigger defaults (VERY IMPORTANT)
ScrollTrigger.defaults({
  markers: false,
  scrub: false,
});

// 🔥 Performance optimization
gsap.config({
  force3D: true,
  nullTargetWarn: false,
});

export { gsap, ScrollTrigger };