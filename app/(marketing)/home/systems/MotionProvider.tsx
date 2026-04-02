"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";

export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial="hidden"
        animate="show"
        className="w-full h-full"
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}