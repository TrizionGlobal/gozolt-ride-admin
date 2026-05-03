import { Skeleton } from '@/components/ui/skeleton';

export default function GdprLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-40 bg-[#1A1A1A]" />
          <Skeleton className="h-4 w-80 bg-[#1A1A1A] mt-2" />
        </div>
        <Skeleton className="h-10 w-36 rounded-md bg-[#1A1A1A]" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#2A2A2A]">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-32 rounded-md bg-[#1A1A1A]" />
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg bg-[#1A1A1A]" />
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-[#1A1A1A]" />
        ))}
      </div>
    </div>
  );
}
