"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!email) return;

    setSuccess(true);

    // later: connect backend
    console.log("Email:", email);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">

      {/* ✨ INPUT */}
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 outline-none backdrop-blur-md focus:border-purple-400 transition"
      />

      {/* 🔥 BUTTON */}
      <motion.button
        onClick={handleSubmit}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-500 to-blue-500 text-white font-semibold relative overflow-hidden"
      >

        {success ? "You're In 🚀" : "Get Early Access"}

        {/* HOVER SHINE */}
        <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition" />

      </motion.button>

    </div>
  );
}