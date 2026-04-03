"use client";

import { motion } from "framer-motion";
import { useRef, ReactNode } from "react";
import { useTilt } from "../../hooks/useTilt";
import { Users, BarChart3, IndianRupee } from "lucide-react";

/* ---------------- TYPES ---------------- */

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
};

type FloatingCardProps = {
  className?: string;
  delay: number;
  label: string;
  value: string | number;
};

/* ---------------- MAIN COMPONENT ---------------- */

export default function DashboardPreview() {
  const ref = useRef<HTMLDivElement | null>(null);

  const { rotateX, rotateY, handleMove, handleLeave } = useTilt(14);

  return (
    <div className="w-full flex justify-center items-center">
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
        className="relative w-full max-w-2xl"
      >
        {/* Glow Background */}
        <div className="absolute -inset-10 bg-white/10 blur-[120px] opacity-40 rounded-full" />

        {/* Main Card */}
        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] p-6">

          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="h-4 w-24 bg-white/20 rounded" />
            <div className="flex gap-2">
              <div className="h-3 w-3 bg-white/20 rounded-full" />
              <div className="h-3 w-3 bg-white/20 rounded-full" />
              <div className="h-3 w-3 bg-white/20 rounded-full" />
            </div>
          </div>

          {/* Chart Area */}
          <div className="h-48 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-white/30 text-sm">
            Analytics Overview
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <StatCard
              icon={<Users size={18} />}
              label="Students"
              value="1,240"
            />
            <StatCard
              icon={<BarChart3 size={18} />}
              label="Growth"
              value="+32%"
            />
            <StatCard
              icon={<IndianRupee size={18} />}
              label="Revenue"
              value="₹48K"
            />
          </div>
        </div>

        {/* Floating Cards */}
        <FloatingCard
          className="absolute -top-6 -left-6"
          delay={0}
          label="Admissions"
          value="+120"
        />

        <FloatingCard
          className="absolute -bottom-6 -right-6"
          delay={1}
          label="Conversion"
          value="18%"
        />
      </motion.div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4 flex flex-col gap-2">
      <div className="text-white/60">{icon}</div>
      <div className="text-sm text-neutral-400">{label}</div>
      <div className="text-white font-semibold">{value}</div>
    </div>
  );
}

function FloatingCard({
  className,
  delay,
  label,
  value,
}: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{
        delay,
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`${className} hidden md:block px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/10`}
    >
      <div className="text-xs text-neutral-400">{label}</div>
      <div className="text-white font-medium">{value}</div>
    </motion.div>
  );
}