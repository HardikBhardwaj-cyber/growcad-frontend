"use client";

import { motion } from "framer-motion";

export default function DashboardPreview() {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      {/* GLOW */}
      <div className="absolute inset-0 bg-purple-500/10 blur-[120px] rounded-full" />

      {/* CARD */}
      <div className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl p-6 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">

        {/* TOP USERS */}
        <div className="flex gap-4 mb-6">
          {["Admin", "Faculty", "Student", "Parent"].map((role, i) => (
            <div key={i} className="flex flex-col items-center text-xs text-gray-300">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 mb-1" />
              {role}
            </div>
          ))}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 p-4 rounded-xl">
            <p className="text-gray-400 text-sm">Revenue</p>
            <h2 className="text-white text-xl font-bold">₹1.2L</h2>
          </div>

          <div className="bg-white/10 p-4 rounded-xl">
            <p className="text-gray-400 text-sm">Students</p>
            <h2 className="text-white text-xl font-bold">324</h2>
          </div>
        </div>

        {/* CHART */}
        <div className="relative h-[150px]">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent rounded-xl" />

                <motion.div
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-blue-500"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 2 }}
                />

                <p className="text-gray-400 text-sm absolute bottom-2 left-3">
                Live Growth
                </p>
            </div>
        </div>
    </motion.div>
  );
}