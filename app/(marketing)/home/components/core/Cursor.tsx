"use client";

import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  const [hovering, setHovering] = useState(false);

  // 🔥 TRACK MOUSE
  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // 🔥 SMOOTH FOLLOW (LERP)
  useEffect(() => {
    let raf: number;

    const animate = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15;

      if (dotRef.current && glowRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
        glowRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  // 🔥 HOVER DETECTION (MAGNETIC SYNC)
  useEffect(() => {
    const handleEnter = () => setHovering(true);
    const handleLeave = () => setHovering(false);

    const elements = document.querySelectorAll(
      "button, a, .magnetic"
    );

    elements.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, []);

  return (
    <>
      {/* 🔥 GLOW LAYER */}
      <div
        ref={glowRef}
        className={`
          pointer-events-none fixed top-0 left-0 z-[9998]
          w-48 h-48 rounded-full
          bg-purple-500/20 blur-3xl
          transition-all duration-300 ease-out
          will-change-transform
          ${hovering ? "scale-150 bg-blue-500/30" : "scale-100"}
        `}
      />

      {/* 🔥 DOT */}
      <div
        ref={dotRef}
        className={`
          pointer-events-none fixed top-0 left-0 z-[9999]
          w-3 h-3 rounded-full bg-white
          mix-blend-difference
          transition-transform duration-200 ease-out
          will-change-transform
          ${hovering ? "scale-150" : "scale-100"}
        `}
      />
    </>
  );
}