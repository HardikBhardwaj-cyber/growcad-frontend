"use client";

import {
  LazyMotion,
  domAnimation,
  m,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  ReactNode,
} from "react";

/* ================= TYPES ================= */

type MotionContextType = {
  depth1X: MotionValue<number>;
  depth1Y: MotionValue<number>;
  depth2X: MotionValue<number>;
  depth2Y: MotionValue<number>;
  depth3X: MotionValue<number>;
  depth3Y: MotionValue<number>;
  scrollDepth: MotionValue<number>;
  drift: MotionValue<number>;
  velocity: MotionValue<number>;
};

/* ================= CONTEXT ================= */

const MotionContext = createContext<MotionContextType | null>(null);

/* ================= PROVIDER ================= */

export default function MotionProvider({
  children,
}: {
  children: ReactNode;
}) {
  /* 🔥 RAW INPUT */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const scrollY = useMotionValue(0);

  // velocity (smoothed)
  const rawVelocity = useMotionValue(0);
  const velocity = useSpring(rawVelocity, {
    stiffness: 100,
    damping: 20,
  });

  const last = useRef({ x: 0, y: 0, t: 0 });

  /* ================= EVENTS ================= */

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(now - last.current.t, 16);

      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;

      const v = Math.sqrt(dx * dx + dy * dy) / dt;
      rawVelocity.set(v);

      last.current = { x: e.clientX, y: e.clientY, t: now };

      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      mx.set(x * 60);
      my.set(y * 60);
    };

    const scroll = () => {
      scrollY.set(window.scrollY);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("scroll", scroll);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", scroll);
    };
  }, [mx, my, scrollY, rawVelocity]);

  /* ================= INERTIA LAYERS ================= */

  const slowX = useSpring(mx, { stiffness: 30, damping: 30 });
  const slowY = useSpring(my, { stiffness: 30, damping: 30 });

  const midX = useSpring(mx, { stiffness: 70, damping: 25 });
  const midY = useSpring(my, { stiffness: 70, damping: 25 });

  const fastX = useSpring(mx, { stiffness: 140, damping: 18 });
  const fastY = useSpring(my, { stiffness: 140, damping: 18 });

  /* ================= DEPTH SYSTEM ================= */

  const depth1X = useTransform(slowX, (v) => v * 0.02);
  const depth1Y = useTransform(slowY, (v) => v * 0.02);

  const depth2X = useTransform(midX, (v) => v * 0.05);
  const depth2Y = useTransform(midY, (v) => v * 0.05);

  const depth3X = useTransform(fastX, (v) => v * 0.1);
  const depth3Y = useTransform(fastY, (v) => v * 0.1);

  /* ================= SCROLL DEPTH ================= */

  const scrollDepth = useTransform(scrollY, (v) => v * -0.2);

  /* ================= TIME DRIFT ================= */

  const time = useMotionValue(0);

  useEffect(() => {
    let raf: number;

    const loop = () => {
      time.set(time.get() + 0.016);
      raf = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(raf);
  }, [time]);

  const drift = useTransform(time, (t) => Math.sin(t) * 10);

  /* ================= CONTEXT VALUE ================= */

  const value: MotionContextType = {
    depth1X,
    depth1Y,
    depth2X,
    depth2Y,
    depth3X,
    depth3Y,
    scrollDepth,
    drift,
    velocity,
  };

  /* ================= RENDER ================= */

  return (
    <MotionContext.Provider value={value}>
      <LazyMotion features={domAnimation}>
        <m.div className="w-full h-full">
          {children}
        </m.div>
      </LazyMotion>
    </MotionContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useMotion(): MotionContextType {
  const context = useContext(MotionContext);

  if (!context) {
    throw new Error("useMotion must be used inside MotionProvider");
  }

  return context;
}