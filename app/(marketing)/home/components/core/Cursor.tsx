"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // 🔥 Cursor follow (smooth)
    const move = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", move);

    // 🔥 Hover interactions
    const hoverables = document.querySelectorAll("a, button, [data-cursor]");

    const listeners: {
      el: Element;
      enter: () => void;
      leave: () => void;
    }[] = [];

    hoverables.forEach((el) => {
      const enter = () => {
        gsap.to(cursor, {
          scale: 2,
          duration: 0.3,
          ease: "power3.out",
        });
      };

      const leave = () => {
        gsap.to(cursor, {
          scale: 1,
          duration: 0.3,
          ease: "power3.out",
        });
      };

      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);

      listeners.push({ el, enter, leave });
    });

    // 🧹 Cleanup (VERY IMPORTANT)
    return () => {
      window.removeEventListener("mousemove", move);

      listeners.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-9999 pointer-events-none
                 w-5 h-5 rounded-full
                 bg-white
                 mix-blend-difference
                 -translate-x-1/2 -translate-y-1/2"
    />
  );
}