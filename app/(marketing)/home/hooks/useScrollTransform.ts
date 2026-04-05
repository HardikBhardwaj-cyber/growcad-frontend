import {
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
  UseScrollOptions,
} from 'framer-motion';
import { RefObject } from 'react';

type Offset = NonNullable<UseScrollOptions['offset']>;

interface ScrollTransformOptions<O extends number | string> {
  target?: RefObject<HTMLElement | null>;
  offset?: Offset;
  inputRange?: number[];
  outputRange?: O[];
  spring?: boolean;
  springConfig?: { damping?: number; stiffness?: number };
}

export function useScrollTransform<O extends number | string = number>({
  target,
  offset = ['start end', 'end start'],
  inputRange = [0, 1],
  outputRange = [0, 1] as O[],
  spring = false,
  springConfig = { damping: 24, stiffness: 120 },
}: ScrollTransformOptions<O> = {}): MotionValue<O> {

  const { scrollYProgress } = useScroll({
    target,
    offset,
  });

  // main transform
  const transformed = useTransform(
    scrollYProgress,
    inputRange,
    outputRange
  ) as MotionValue<O>;

  // ✅ create a SAFE numeric transform for spring
  const numeric = useTransform(scrollYProgress, inputRange, inputRange);

  const springValue = useSpring(numeric, springConfig);

  // ✅ map spring back to output range
  const sprungTransformed = useTransform(
    springValue,
    inputRange,
    outputRange
  ) as MotionValue<O>;

  return spring ? sprungTransformed : transformed;
}