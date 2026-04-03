"use client";

import {
  LazyMotion,
  domAnimation,
  m,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useVelocity,
  MotionValue,
} from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useState,
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

  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;

  scrollDepth: MotionValue<number>;
  scrollProgress: MotionValue<number>;

  drift: MotionValue<number>;
  velocity: MotionValue<number>;

  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
};

/* ================= CONTEXT ================= */

const MotionContext = createContext<MotionContextType | null>(null);

/* ================= PROVIDER ================= */

export default function MotionProvider({
  children,
}: {
  children: ReactNode;
}) {
  /* ================= VIEWPORT ================= */

  const [vh, setVh] = useState(1000);
  const [vw, setVw] = useState(1920);

  useEffect(() => {
    const update = () => {
      setVh(window.innerHeight);
      setVw(window.innerWidth);
    };

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  /* ================= MOUSE ================= */

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const mouseX = useMotionValue(0); // 0 → 1
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const nx = (e.clientX / vw - 0.5) * 2;
      const ny = (e.clientY / vh - 0.5) * 2;

      mouseX.set(e.clientX / vw);
      mouseY.set(e.clientY / vh);

      mx.set(nx * 60);
      my.set(ny * 60);
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, [mx, my, mouseX, mouseY, vw, vh]);

  /* ================= VELOCITY ================= */

  const vx = useVelocity(mx);
  const vy = useVelocity(my);

  const velocity = useTransform(
    [vx, vy],
    (latest: number[]) => {
      const [vxVal, vyVal] = latest;
      return Math.min(Math.sqrt(vxVal * vxVal + vyVal * vyVal), 1000);
    }
  );

  /* ================= INERTIA ================= */

  const slowX = useSpring(mx, { stiffness: 30, damping: 30 });
  const slowY = useSpring(my, { stiffness: 30, damping: 30 });

  const midX = useSpring(mx, { stiffness: 70, damping: 25 });
  const midY = useSpring(my, { stiffness: 70, damping: 25 });

  const fastX = useSpring(mx, { stiffness: 140, damping: 18 });
  const fastY = useSpring(my, { stiffness: 140, damping: 18 });

  /* ================= DEPTH ================= */

  const depth1X = useTransform(slowX, (v) => v * 0.02);
  const depth1Y = useTransform(slowY, (v) => v * 0.02);

  const depth2X = useTransform(midX, (v) => v * 0.05);
  const depth2Y = useTransform(midY, (v) => v * 0.05);

  const depth3X = useTransform(fastX, (v) => v * 0.1);
  const depth3Y = useTransform(fastY, (v) => v * 0.1);

  /* ================= ROTATION ================= */

  const rotateX = useTransform(fastY, [-60, 60], [6, -6]);
  const rotateY = useTransform(fastX, [-60, 60], [-6, 6]);

  /* ================= SCROLL ================= */

  const { scrollYProgress } = useScroll();

  const scrollDepth = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const scrollProgress = scrollYProgress;

  /* ================= DRIFT ================= */

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

  const drift = useTransform(time, (t) => Math.sin(t) * 8);

  /* ================= CONTEXT ================= */

  const value: MotionContextType = {
    depth1X,
    depth1Y,
    depth2X,
    depth2Y,
    depth3X,
    depth3Y,

    rotateX,
    rotateY,

    scrollDepth,
    scrollProgress,

    drift,
    velocity,

    mouseX,
    mouseY,
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