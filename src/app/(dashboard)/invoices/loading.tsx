import { Skeleton } from '@/components/ui/skeleton';

export default function InvoicesLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40 bg-[#1A1A1A]" />
          <Skeleton className="h-4 w-72 bg-[#1A1A1A]" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg bg-[#1A1A1A]" />
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full bg-[#1A1A1A]" />
        ))}
      </div>

      {/* Table */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-[#1A1A1A]" />
        ))}
      </div>
    </div>
  );
}
