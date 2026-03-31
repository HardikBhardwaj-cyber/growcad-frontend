"use client";

import { useState } from "react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;

    setLoading(true);

    // 🔥 TEMP (replace later with API)
    setTimeout(() => {
      setLoading(false);
      setEmail("");
      alert("You're on the early access list 🚀");
    }, 800);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-md">

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white w-full outline-none focus:border-purple-400 transition"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:scale-105 transition disabled:opacity-50"
      >
        {loading ? "..." : "Get Early Access"}
      </button>
    </div>
  );
}