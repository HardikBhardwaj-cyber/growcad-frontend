"use client";

import { useEffect } from "react";

export default function ScrollFix() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "auto";
  }, []);

  return null;
}