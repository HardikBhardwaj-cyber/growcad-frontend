import { useMotionValue, useSpring, motion } from "framer-motion";
import { useRef } from "react";

export default function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, { stiffness: 120, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 120, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    x.set((px - 0.5) * 20);
    y.set((py - 0.5) * -20);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      style={{
        rotateX: smoothY,
        rotateY: smoothX,
        transformPerspective: 1200,
      }}
      className="relative"
    />)