"use client";

import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const glowRef = useRef<HTMLDivElement | null>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const glow = useRef({ x: 0, y: 0 });

  const rafRef = useRef<number | null>(null);
  const mounted = useRef(true);

  const [hovering, setHovering] = useState(false);

  /* 🔥 DISABLE ON TOUCH DEVICES */
  useEffect(() => {
    if ("ontouchstart" in window) {
      if (glowRef.current) glowRef.current.style.display = "none";
    }
  }, []);

  /* 🔥 TRACK MOUSE */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", move, { passive: true });

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  /* 🔥 ULTRA SMOOTH ANIMATION LOOP */
  useEffect(() => {
    mounted.current = true;

    const animate = () => {
      if (!mounted.current) return;


      // slow glow
      glow.current.x += (mouse.current.x - glow.current.x) * 0.12;
      glow.current.y += (mouse.current.y - glow.current.y) * 0.12;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glow.current.x}px, ${glow.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      mounted.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* 🔥 STABLE HOVER DETECTION (NO FLICKER, NO LEAK) */
  useEffect(() => {
    const handlePointerOver = (e: Event) => {
      const target = (e.target as HTMLElement)?.closest(
        "button, a, .magnetic"
      );
      setHovering(!!target);
    };

    document.addEventListener("pointerover", handlePointerOver);

    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
    };
  }, []);

  return (
    <>
      {/* 🔥 GLOW */}
      <div
        ref={glowRef}
        className={`
          pointer-events-none fixed top-0 left-0 z-[9998]
          w-56 h-56 rounded-full
          bg-purple-500/20 blur-[80px]
          will-change-transform
          transition-all duration-300 ease-out
          ${hovering ? "scale-150 bg-blue-500/30" : "scale-100"}
        `}
      />

      
    </>
  );
}