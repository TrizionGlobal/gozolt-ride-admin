import { Skeleton } from '@/components/ui/skeleton';

export default function PaymentsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-52 bg-[#1A1A1A]" />
          <Skeleton className="h-4 w-64 bg-[#1A1A1A]" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28 bg-[#1A1A1A]" />
          <Skeleton className="h-10 w-40 bg-[#1A1A1A]" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg bg-[#1A1A1A]" />
        ))}
      </div>

      {/* Tabs */}
      <Skeleton className="h-10 w-[480px] bg-[#1A1A1A]" />

      {/* Table */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-[#1A1A1A]" />
        ))}
      </div>
    </div>
  );
}
