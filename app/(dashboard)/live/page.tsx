"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { createLive, getLive } from "@/modules/live/api";
import Button from "@/components/ui/Button";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";

// ✅ TYPES
type LiveClass = {
  id: string;
  title?: string;
  link: string;
};

type LiveMeta = {
  active_classes: number;
  max_allowed: number;
};

export default function LivePage() {
  const plan = "academic";
  const access = useFeatureAccess(plan);

  // 🔥 ALWAYS CALL HOOKS FIRST (CRITICAL FIX)
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["live"],
    queryFn: getLive,
  });

  const mutation = useMutation({
    mutationFn: createLive,
    onSuccess: () => refetch(),
  });

  // 🔥 FEATURE CHECK AFTER HOOKS
  if (!access.live) {
    return (
      <div className="p-6 text-yellow-400">
        Upgrade to access Live Classes
      </div>
    );
  }

  if (isLoading)
    return <p className="p-6 text-gray-400">Loading...</p>;

  if (error)
    return <p className="p-6 text-red-400">Error loading live classes</p>;

  // ✅ FIX AXIOS STRUCTURE
  const list: LiveClass[] = data?.data || [];

  const meta: LiveMeta = data?.meta || {
    active_classes: 0,
    max_allowed: 3,
  };

  const handleCreate = () => {
    if (meta.active_classes >= meta.max_allowed) {
      alert("Upgrade to add more live classes");
      return;
    }

    mutation.mutate();
  };

  return (
    <div className="p-4 md:p-6">

      {/* 🔥 LIMIT INFO (UPSELL DRIVER) */}
      <div className="mb-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
        <p className="text-sm text-yellow-400 font-medium">
          Active: {meta.active_classes} / {meta.max_allowed}
        </p>

        {meta.active_classes >= meta.max_allowed * 0.8 && (
          <p className="text-xs text-yellow-300 mt-1">
            You are near your limit. Upgrade now 🚀
          </p>
        )}
      </div>

      {/* CREATE */}
      <Button
        loading={mutation.isPending}
        onClick={handleCreate}
      >
        Create Live Class
      </Button>

      {/* LIST */}
      <div className="mt-6 space-y-2">
        {list.map((l) => (
          <div
            key={l.id}
            className="flex justify-between items-center p-3 rounded-xl border border-white/10 bg-white/5"
          >
            <span>{l.title || "Live Class"}</span>

            <a
              href={l.link}
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              Join
            </a>
          </div>
        ))}
      </div>

    </div>
  );
}