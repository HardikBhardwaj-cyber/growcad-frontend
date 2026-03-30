export default function Badge({
  text,
}: {
  text: string;
}) {
  return (
    <span className="px-3 py-1 text-xs rounded-full bg-purple-600/20 text-purple-400">
      {text}
    </span>
  );
}