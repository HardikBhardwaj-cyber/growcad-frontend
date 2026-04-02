"use client";

import { motion } from "framer-motion";
import { InputHTMLAttributes, ReactNode, useState } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: ReactNode;
  error?: string;
};

/* ================= COMPONENT ================= */

export default function Input({
  label,
  icon,
  error,
  className = "",
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const isActive = focused || props.value;

  return (
    <div className="relative w-full">
      {/* 🔥 INPUT WRAPPER */}
      <motion.div
        animate={{
          boxShadow: focused
            ? "0 0 0 2px rgba(124,58,237,0.5)"
            : "0 0 0 1px rgba(255,255,255,0.1)",
        }}
        transition={{ duration: 0.25 }}
        className="relative flex items-center rounded-xl bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3"
      >
        {/* 🔥 ICON */}
        {icon && (
          <div className="mr-2 text-white/60 flex items-center">
            {icon}
          </div>
        )}

        {/* 🔥 INPUT FIELD */}
        <input
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-transparent outline-none text-white placeholder-transparent ${className}`}
        />

        {/* 🔥 FLOATING LABEL */}
        {label && (
          <motion.label
            animate={{
              y: isActive ? -18 : 0,
              scale: isActive ? 0.85 : 1,
              color: focused ? "#a78bfa" : "#94a3b8",
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 origin-left pointer-events-none text-sm"
          >
            {label}
          </motion.label>
        )}
      </motion.div>

      {/* 🔥 ERROR TEXT */}
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}