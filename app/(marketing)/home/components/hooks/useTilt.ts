import { useRef, MouseEvent as ReactMouseEvent } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

interface TiltOptions {
  max?: number;
  scale?: number;
}

export function useTilt<T extends HTMLElement = HTMLDivElement>({ max = 10, scale = 1.02 }: TiltOptions = {}) {
  const ref = useRef<T>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawScale = useMotionValue(1);

  const rotateX = useSpring(rawX, { damping: 25, stiffness: 300 });
  const rotateY = useSpring(rawY, { damping: 25, stiffness: 300 });
  const scaleValue = useSpring(rawScale, { damping: 25, stiffness: 300 });

  const onMouseMove = (e: ReactMouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rawX.set(-dy * max);
    rawY.set(dx * max);
    rawScale.set(scale);
  };

  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    rawScale.set(1);
  };

  return { ref, rotateX, rotateY, scale: scaleValue, onMouseMove, onMouseLeave };
}
