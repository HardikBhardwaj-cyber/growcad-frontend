import Skeleton from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="p-6 grid md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );
}