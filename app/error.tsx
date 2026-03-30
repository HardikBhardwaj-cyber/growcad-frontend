"use client";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      
      <h2 className="text-xl text-red-400">
        Something went wrong
      </h2>

      <p className="text-gray-400 mt-2">
        Please refresh or try again
      </p>

      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-purple-600 rounded-xl"
      >
        Retry
      </button>

    </div>
  );
}