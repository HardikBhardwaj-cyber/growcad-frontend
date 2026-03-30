"use client";

import { useMemo } from "react";
import type { Persona } from "./usePersona";

export function useDynamicHeadline(persona: Persona) {
  return useMemo(() => {
    const variants: Record<Persona, string[]> = {
      small: [
        "Get more students without increasing ad spend",
        "Grow your coaching institute faster than competitors",
      ],
      medium: [
        "Scale your institute without hiring more staff",
        "Automate operations and focus on growth",
      ],
      large: [
        "Run your multi-branch institute like a tech company",
        "Full control over revenue, teams, and performance",
      ],
      default: [
        "Dominate your coaching market with GROWCAD",
      ],
    };

    const options = variants[persona] || variants.default;

    // ✅ deterministic index (NO Math.random)
    const index = persona.length % options.length;

    return options[index];
  }, [persona]);
}