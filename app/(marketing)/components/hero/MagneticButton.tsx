"use client";

export default function MagneticButton({
  label,
  primary = false,
}: {
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
        primary
          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105"
          : "border border-white/20 text-white hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}