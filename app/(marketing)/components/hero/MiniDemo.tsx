"use client";

import { useState } from "react";

export default function MiniDemo() {
  const [active, setActive] = useState(false);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      {!active ? (
        <button
          onClick={() => setActive(true)}
          className="text-purple-400"
        >
          ▶ Try Live Demo
        </button>
      ) : (
        <div className="space-y-2 text-sm text-gray-300">
          <p>📌 New Student Added</p>
          <p>💰 Fee Collected: ₹5,000</p>
          <p>📊 Attendance Updated</p>
        </div>
      )}
    </div>
  );
}