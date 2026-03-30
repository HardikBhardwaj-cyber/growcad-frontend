"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import Button from "@/components/ui/Button";

// 🔥 Dummy APIs (replace later)
const getDoubts = async () => {
  return { data: [] };
};

const generateDoubt = async (text: string) => {
  return { data: { text } };
};

export default function AIPage() {
  const user = useAuthStore((s) => s.user);

  // 🔥 ALL HOOKS AT TOP (IMPORTANT)
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["ai-doubts"],
    queryFn: getDoubts,
  });

  const mutation = useMutation({
    mutationFn: generateDoubt,
  });

  // 🔥 FEATURE ACCESS CHECK AFTER HOOKS
  if (user?.role === "basic") {
    return (
      <div className="p-6 text-center text-yellow-400">
        Upgrade to access AI features
      </div>
    );
  }

  const doubts = data?.data || [];

  const filtered = doubts.filter((d: { text: string }) =>
    d.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">

      {/* GENERATE */}
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask doubt..."
          className="p-2 border border-white/10 rounded-xl bg-white/5 w-full"
        />

        <Button
          loading={mutation.isPending}
          onClick={() => mutation.mutate(query)}
        >
          Generate
        </Button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search doubts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border border-white/10 rounded-xl bg-white/5 w-full"
      />

      {/* LIST */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((d: { text: string }, i: number) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              {d.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}