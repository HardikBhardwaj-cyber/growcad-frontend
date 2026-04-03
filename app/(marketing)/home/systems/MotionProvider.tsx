"use client";

import {
  createContext,
  useContext,
  useRef,
  ReactNode,
} from "react";
import {
  useScroll,
  MotionValue,
} from "framer-motion";

/* ---------------- TYPES ---------------- */

type MotionContextType = {
  scrollYProgress: MotionValue<number>;
};

/* ---------------- CONTEXT ---------------- */

const MotionContext = createContext<MotionContextType | null>(null);

/* ---------------- PROVIDER ---------------- */

export function MotionProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <MotionContext.Provider value={{ scrollYProgress }}>
      <div ref={ref} className="relative">
        {children}
      </div>
    </MotionContext.Provider>
  );
}

/* ---------------- HOOK ---------------- */

export function useMotion(): MotionContextType {
  const context = useContext(MotionContext);

  if (!context) {
    throw new Error("useMotion must be used inside MotionProvider");
  }

  return context;
}