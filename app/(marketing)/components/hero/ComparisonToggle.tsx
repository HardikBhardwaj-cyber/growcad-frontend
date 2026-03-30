"use client";

import { useState } from "react";

type Mode = "excel" | "software" | "none";

const content: Record<Mode | "growcad", string> = {
  excel: "Manual work, errors, no growth insights ❌",
  software: "Complex, outdated, not growth-focused ❌",
  none: "No system, no tracking, no scalability ❌",
  growcad: "Automation + analytics + growth engine ✅",
};

export default function ComparisonToggle() {
  const [mode, setMode] = useState<Mode>("excel");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["excel", "software", "none"] as Mode[]).map((item) => (
          <button
            key={item}
            onClick={() => setMode(item)}
            className={`px-4 py-2 rounded-lg ${
              mode === item
                ? "bg-purple-500 text-white"
                : "bg-white/10 text-gray-300"
            }`}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bg-white/5 p-4 rounded-xl text-sm text-gray-300">
        {content[mode]}
        <div className="mt-2 text-green-400">
          → With GROWCAD: {content.growcad}
        </div>
      </div>
    </div>
  );
}