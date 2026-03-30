"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function FloatingCards() {
  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, 500], [0, -80]);
  const y2 = useTransform(scrollY, [0, 500], [0, 80]);

  return (
    <div className="absolute inset-0 pointer-events-none">

      <motion.div style={{ y: y1 }} className="absolute top-[20%] left-[10%] bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
        <p className="text-sm text-gray-300">Attendance</p>
        <p className="text-green-400 font-semibold">98% Present</p>
      </motion.div>

      <motion.div style={{ y: y2 }} className="absolute bottom-[20%] left-[15%] bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
        <p className="text-sm text-gray-300">Fees</p>
        <p className="text-purple-400 font-semibold">₹1.2L Collected</p>
      </motion.div>

      <motion.div style={{ y: y1 }} className="absolute top-[25%] right-[10%] bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
        <p className="text-sm text-gray-300">AI Tests</p>
        <p className="text-blue-400 font-semibold">Auto Generated</p>
      </motion.div>

      <motion.div style={{ y: y2 }} className="absolute bottom-[15%] right-[15%] bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
        <p className="text-sm text-gray-300">Growth</p>
        <p className="text-yellow-400 font-semibold">+32%</p>
      </motion.div>
    </div>
  );
}