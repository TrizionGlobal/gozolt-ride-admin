import { Skeleton } from '@/components/ui/skeleton';

export default function PenaltiesLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-40 bg-[#1A1A1A]" />
        <Skeleton className="h-4 w-72 bg-[#1A1A1A]" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg bg-[#1A1A1A]" />
        ))}
      </div>

      {/* Filters */}
      <Skeleton className="h-10 w-full bg-[#1A1A1A]" />

      {/* Table */}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4 space-y-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-[#1A1A1A]" />
        ))}
      </div>
    </div>
  );
}
