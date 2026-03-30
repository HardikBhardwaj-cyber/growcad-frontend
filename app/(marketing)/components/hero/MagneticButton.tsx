"use client";

export default function MagneticButton({
  children,
  onClick,
  primary = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  primary?: boolean;
}) {
  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    e.currentTarget.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  return (
    <button
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translate(0,0)")}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
        primary
          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
          : "border border-gray-700 text-white hover:bg-gray-800"
      }`}
    >
      {children}
    </button>
  );
}