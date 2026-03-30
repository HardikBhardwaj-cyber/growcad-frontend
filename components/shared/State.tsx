export function LoadingState() {
  return (
    <div className="p-6 text-center text-gray-400">
      Loading...
    </div>
  );
}

export function ErrorState() {
  return (
    <div className="p-6 text-center text-red-400">
      Something went wrong. Try again.
    </div>
  );
}

export function EmptyState({
  text = "No data found",
}: {
  text?: string;
}) {
  return (
    <div className="p-6 text-center text-gray-400">
      {text}
    </div>
  );
}