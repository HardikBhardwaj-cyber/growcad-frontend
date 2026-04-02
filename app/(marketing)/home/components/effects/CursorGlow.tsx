"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Mode = "default" | "hover" | "text";

export default function CursorGlow() {
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(true);
  const [click, setClick] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 🔥 SMOOTH + INERTIA
  const sx = useSpring(x, { stiffness: 180, damping: 20 });
  const sy = useSpring(y, { stiffness: 180, damping: 20 });

  const lagX = useSpring(x, { stiffness: 60, damping: 20 });
  const lagY = useSpring(y, { stiffness: 60, damping: 20 });

  // 🔥 VELOCITY TRACKING (REAL)
  const last = useRef({ x: 0, y: 0, t: 0 });
  const speed = useMotionValue(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(now - last.current.t, 16);

      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;

      const v = Math.sqrt(dx * dx + dy * dy) / dt;
      speed.set(v);

      last.current = { x: e.clientX, y: e.clientY, t: now };

      x.set(e.clientX);
      y.set(e.clientY);
    };

    const down = (e: MouseEvent) => {
      setClick(true);
      setTimeout(() => setClick(false), 250);
    };

    const over = (e: Event) => {
      const el = e.target as HTMLElement;

      if (el.closest("[data-cursor='text']")) {
        setMode("text");
      } else if (el.closest("button, a, [data-cursor='hover']")) {
        setMode("hover");
      } else {
        setMode("default");
      }
    };

    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseleave", leave);
    window.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseleave", leave);
      window.removeEventListener("mouseenter", enter);
    };
  }, []);

  // 🔥 REACTIVE SPEED → SCALE
  const reactiveScale = useTransform(speed, [0, 1], [1, 1.4]);

  const baseScale =
    mode === "hover" ? 1.6 : mode === "text" ? 0.8 : reactiveScale;

  return (
    <>
      {/* 🔥 MAIN GLOW */}
      <motion.div
        style={{ translateX: sx, translateY: sy, opacity: visible ? 1 : 0 }}
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
      >
        <motion.div
          style={{ scale: baseScale }}
          className="w-[360px] h-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/25 blur-[120px]"
        />
      </motion.div>

      {/* 🔥 CORE DOT */}
      <motion.div
        style={{ translateX: sx, translateY: sy }}
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
      >
        <motion.div
          animate={{ scale: click ? 0.6 : 1 }}
          className="w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-300 shadow-[0_0_30px_#7c3aed]"
        />
      </motion.div>

      {/* 🔥 TRAIL (INERTIA LAYER) */}
      <motion.div
        style={{ translateX: lagX, translateY: lagY }}
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
      >
        <div className="w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[140px]" />
      </motion.div>

      {/* 🔥 AMBIENT DEPTH */}
      <motion.div
        style={{ translateX: lagX, translateY: lagY }}
        className="pointer-events-none fixed top-0 left-0 z-[9997]"
      >
        <div className="w-[520px] h-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[180px]" />
      </motion.div>

      {/* 🔥 CLICK SHOCKWAVE */}
      {click && (
        <motion.div
          style={{ translateX: x, translateY: y }}
          initial={{ scale: 0, opacity: 0.4 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none fixed top-0 left-0 z-[9996]"
        >
          <div className="w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-400" />
        </motion.div>
      )}
    </>
  );
}