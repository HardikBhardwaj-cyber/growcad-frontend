export default function GridBackground() {
  return (
    <>
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 bg-purple-600/20 blur-[200px] rounded-full" />
    </>
  );
}