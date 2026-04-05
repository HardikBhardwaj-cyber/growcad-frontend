import { useInView } from 'framer-motion';
import { useRef, RefObject } from 'react';

type MarginType = `${number}px` | `${number}%`;

interface RevealOptions {
  once?: boolean;
  amount?: number;
  margin?: MarginType;
}

export function useReveal<T extends Element = HTMLDivElement>({
  once = true,
  amount = 0.15,
  margin = '0px',
}: RevealOptions = {}): [RefObject<T | null>, boolean] {

  const ref = useRef<T | null>(null);

  const isInView = useInView(ref, {
    once,
    amount,
    margin,
  });

  return [ref, isInView];
}