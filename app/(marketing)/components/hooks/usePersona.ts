"use client";

import { useMemo } from "react";

export type Persona = "default" | "small" | "medium" | "large";

export function usePersona(): Persona {
  return useMemo(() => {
    if (typeof document === "undefined") return "default";

    const ref = document.referrer.toLowerCase();

    if (ref.includes("facebook") || ref.includes("whatsapp")) {
      return "small";
    }

    if (ref.includes("google")) {
      return "medium";
    }

    if (ref === "") {
      return "default";
    }

    return "large";
  }, []);
}