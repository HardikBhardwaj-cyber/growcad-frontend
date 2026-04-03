export default function Glow() {
  return (
    <>
      {/* Top glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-600 opacity-30 blur-[120px] rounded-full" />

      {/* Bottom glow */}
      <div className="absolute bottom-[-200px] right-1/2 translate-x-1/2 w-[700px] h-[700px] bg-blue-500 opacity-20 blur-[120px] rounded-full" />
    </>
  );
}