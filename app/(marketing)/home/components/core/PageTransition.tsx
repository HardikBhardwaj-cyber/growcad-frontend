"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ENTER animation
      gsap.fromTo(
        container.current,
        {
          opacity: 0,
          filter: "blur(10px)",
          y: 40,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.8,
        }
      );
    }, container);

    return () => ctx.revert();
  }, [pathname]);

  return <div ref={container}>{children}</div>;
}