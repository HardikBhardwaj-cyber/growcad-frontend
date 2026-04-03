"use client";

import { useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function Splash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      ".splash-logo",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8 }
    )
      .to(".splash-logo", {
        opacity: 0,
        scale: 1.2,
        duration: 0.6,
        delay: 0.5,
      })
      .to(".splash-screen", {
        opacity: 0,
        duration: 0.5,
        onComplete: () => setVisible(false),
      });
  }, []);

  if (!visible) return null;

  return (
    <div className="splash-screen fixed inset-0 z-[99999] bg-black flex items-center justify-center">
      <h1 className="splash-logo text-white text-4xl font-bold tracking-wide">
        GROWCAD
      </h1>
    </div>
  );
}