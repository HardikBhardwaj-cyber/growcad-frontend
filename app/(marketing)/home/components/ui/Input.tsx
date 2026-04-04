"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  InputHTMLAttributes,
  ReactNode,
  useState,
  useId,
} from "react";
import clsx from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: ReactNode;
  error?: string;
};

export default function Input({
  label,
  icon,
  error,
  className,
  disabled,
  required,
  value,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const id = useId();

  const shouldReduceMotion = useReducedMotion();

  /* ================= ACTIVE STATE ================= */

  const isActive =
    focused || (value !== undefined && value !== "");

  /* ================= CURSOR LIGHT ================= */

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    mx.set(x);
    my.set(y);
  };

  const glowX = useTransform(sx, [0, 1], [0, 100]);
  const glowY = useTransform(sy, [0, 1], [0, 100]);

  // ✅ FIXED (no hook inside render)
  const glowBg = useTransform(
    [glowX, glowY],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.12), transparent 60%)`
  );

  /* ================= COMPONENT ================= */

  return (
    <div className="relative w-full">
      {/* 🔥 WRAPPER */}
      <motion.div
        onMouseMove={handleMove}
        animate={{
          boxShadow: focused
            ? "0 10px 40px rgba(124,58,237,0.25)"
            : "0 4px 20px rgba(0,0,0,0.4)",
          borderColor: focused
            ? "rgba(124,58,237,0.6)"
            : error
            ? "rgba(239,68,68,0.6)"
            : "rgba(255,255,255,0.08)",
        }}
        transition={{ duration: 0.25 }}
        className={clsx(
          "relative flex items-center rounded-xl backdrop-blur-md border px-4 py-3 overflow-hidden",
          disabled
            ? "bg-white/5 opacity-50 cursor-not-allowed"
            : "bg-white/5"
        )}
      >
        {/* 🔥 CURSOR LIGHT */}
        {!shouldReduceMotion && (
          <motion.div
            style={{ background: glowBg }}
            className="absolute inset-0 pointer-events-none"
          />
        )}

        {/* 🔥 ICON */}
        {icon && (
          <div className="mr-2 text-white/50 flex items-center">
            {icon}
          </div>
        )}

        {/* 🔥 INPUT */}
        <input
          id={id}
          {...props}
          value={value}
          disabled={disabled}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={clsx(
            "w-full bg-transparent outline-none text-white placeholder-transparent",
            className
          )}
        />

        {/* 🔥 LABEL */}
        {label && (
          <motion.label
            htmlFor={id}
            animate={{
              y: isActive ? -20 : 0,
              scale: isActive ? 0.82 : 1,
              color: error
                ? "#f87171"
                : focused
                ? "#a78bfa"
                : "#94a3b8",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="absolute left-4 origin-left pointer-events-none text-sm"
          >
            {label} {required && "*"}
          </motion.label>
        )}
      </motion.div>

      {/* 🔥 ERROR */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-xs text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}