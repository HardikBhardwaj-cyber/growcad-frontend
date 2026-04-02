"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  /* ================= VALIDATION ================= */

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setState("error");
      return;
    }

    setState("loading");

    // 🔥 simulate API
    await new Promise((res) => setTimeout(res, 1200));

    setState("success");
  };

  /* ================= UI ================= */

  return (
    <div className="w-full max-w-md">

      {/* 🔥 INPUT + BUTTON */}
      <div className="flex flex-col sm:flex-row gap-3">

        {/* INPUT */}
        <div className="relative flex-1">
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state === "error") setState("idle");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Enter your email"
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-400 outline-none backdrop-blur-md transition
              ${
                state === "error"
                  ? "border-red-400"
                  : "border-white/10 focus:border-purple-400"
              }
            `}
          />

          {/* 🔥 FOCUS GLOW */}
          <div className="absolute inset-0 rounded-xl pointer-events-none blur-xl opacity-0 focus-within:opacity-40 bg-purple-500/20 transition" />
        </div>

        {/* BUTTON */}
        <motion.button
          onClick={handleSubmit}
          disabled={state === "loading"}
          whileTap={{ scale: 0.95 }}
          className="relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden"
        >
          {/* 🔥 BACKGROUND */}
          <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-blue-500" />

          {/* 🔥 CONTENT */}
          <AnimatePresence mode="wait">
            {state === "loading" && (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10"
              >
                Loading...
              </motion.span>
            )}

            {state === "success" && (
              <motion.span
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10"
              >
                You are In 🚀
              </motion.span>
            )}

            {state === "idle" && (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10"
              >
                Get Early Access
              </motion.span>
            )}

            {state === "error" && (
              <motion.span
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 text-red-200"
              >
                Invalid Email
              </motion.span>
            )}
          </AnimatePresence>

          {/* 🔥 SHIMMER */}
          <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition" />
        </motion.button>
      </div>

      {/* 🔥 ERROR TEXT */}
      {state === "error" && (
        <p className="text-red-400 text-xs mt-2">
          Please enter a valid email address.
        </p>
      )}

      {/* 🔥 TRUST */}
      {state !== "error" && (
        <p className="text-gray-500 text-xs mt-2">
          No spam. Early access only.
        </p>
      )}
    </div>
  );
}