"use client";

import { motion } from "framer-motion";

export default function Modal({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass p-6 rounded-2xl"
      >
        {children}
      </motion.div>
    </div>
  );
}