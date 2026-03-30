"use client";

import { motion } from "framer-motion";

export default function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="
        mt-10
        mx-auto
        max-w-5xl
        rounded-xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        p-4
        shadow-[0_0_60px_rgba(124,58,237,0.15)]
      "
    >
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-purple-500/10 p-4 rounded-lg">
          <p className="text-gray-400">Students</p>
          <h3 className="text-xl font-bold">10,482</h3>
        </div>
        <div className="bg-blue-500/10 p-4 rounded-lg">
          <p className="text-gray-400">Fees Collected</p>
          <h3 className="text-xl font-bold">₹12.4L</h3>
        </div>
        <div className="bg-green-500/10 p-4 rounded-lg">
          <p className="text-gray-400">Attendance</p>
          <h3 className="text-xl font-bold">96%</h3>
        </div>
      </div>
    </motion.div>
  );
}