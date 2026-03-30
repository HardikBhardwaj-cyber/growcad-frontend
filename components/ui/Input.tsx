"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import {
  InputHTMLAttributes,
  forwardRef,
} from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">

        {label && (
          <label className="block mb-1 text-sm text-gray-400">
            {label}
          </label>
        )}

        {/* ✅ FIXED */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <input
            ref={ref}
            className={clsx(
              "w-full px-4 py-2 rounded-xl",
              "bg-white/5 border border-white/10 text-white",
              "outline-none transition-all duration-200",
              "focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
              "placeholder:text-gray-500",

              error &&
                "border-red-500 focus:ring-red-500/20",

              className
            )}
            {...props}
          />
        </motion.div>

        {error && (
          <p className="mt-1 text-xs text-red-400">
            {error}
          </p>
        )}

      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;