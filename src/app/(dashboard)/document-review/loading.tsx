import { Skeleton } from '@/components/ui/skeleton';

export default function DocumentReviewLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-56 bg-[#1A1A1A]" />
          <Skeleton className="h-4 w-48 mt-2 bg-[#1A1A1A]" />
        </div>
        <Skeleton className="h-10 w-32 bg-[#1A1A1A]" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[#2A2A2A] bg-[#141414] px-4 py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-md bg-[#2A2A2A]" />
              <div className="space-y-1">
                <Skeleton className="h-6 w-10 bg-[#2A2A2A]" />
                <Skeleton className="h-3 w-20 bg-[#2A2A2A]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Skeleton className="h-10 w-full bg-[#1A1A1A]" />

      {/* Pending cards */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg bg-[#1A1A1A]" />
        ))}
      </div>
    </div>
  );
}
