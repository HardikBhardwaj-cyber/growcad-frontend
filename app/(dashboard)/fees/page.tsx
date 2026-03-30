"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getFees, markPaid, FeesResponse } from "@/modules/fees/api";
import Button from "@/components/ui/Button";

export default function FeesPage() {
  const { data, isLoading, error, refetch } = useQuery<FeesResponse>({
    queryKey: ["fees"],
    queryFn: getFees,
  });

  const mutation = useMutation({
    mutationFn: markPaid,
    onSuccess: () => refetch(),
  });

  if (isLoading)
    return <p className="p-6 text-gray-400">Loading...</p>;

  if (error)
    return <p className="p-6 text-red-400">Error loading fees</p>;

  // ✅ CLEAN DATA
  const fees = data?.list ?? [];
  const totalPending = data?.total_pending ?? 0;

  return (
    <div className="p-4 md:p-6">
      <h2 className="mb-4 text-xl font-semibold">Fees</h2>

      <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
        <p className="text-red-400 font-semibold">
          Total Pending: ₹{totalPending}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Follow up to increase collection 🚀
        </p>
      </div>

      <div className="space-y-2">
        {fees.map((f) => (
          <div
            key={f.id}
            className="flex justify-between items-center p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            <span>
              {f.name} — ₹{f.amount}
            </span>

            {f.paid ? (
              <span className="text-green-400 font-medium">
                Paid ✅
              </span>
            ) : (
              <Button
                loading={mutation.isPending}
                onClick={() => mutation.mutate(f.id)}
              >
                Mark Paid
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}