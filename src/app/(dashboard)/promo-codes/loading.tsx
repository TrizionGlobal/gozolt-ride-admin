import { Skeleton } from '@/components/ui/skeleton';

export default function PromoCodesLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 bg-[#1A1A1A]" />
        <Skeleton className="h-4 w-80 bg-[#1A1A1A]" />
      </div>

      {/* Config Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-56 rounded-lg bg-[#1A1A1A]" />
        <Skeleton className="h-56 rounded-lg bg-[#1A1A1A]" />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4 space-y-3">
        <Skeleton className="h-8 w-40 bg-[#1A1A1A]" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-[#1A1A1A]" />
        ))}
      </div>
    </div>
  );
}
