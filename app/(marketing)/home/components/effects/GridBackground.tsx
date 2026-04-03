"use client";

export default function GridBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">

      {/* Base Gradient (important for premium look) */}
      <div className="absolute inset-0 bg-black" />

      {/* Grid Layer */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial Fade (center highlight) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_60%)]" />

      {/* Top Fade (hero readability) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

    </div>
  );
}