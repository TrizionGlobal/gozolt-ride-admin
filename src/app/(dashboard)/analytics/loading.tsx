import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36 bg-[#1A1A1A]" />
          <Skeleton className="h-4 w-64 bg-[#1A1A1A]" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-48 bg-[#1A1A1A]" />
          <Skeleton className="h-10 w-28 bg-[#1A1A1A]" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg bg-[#1A1A1A]" />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-72 rounded-lg bg-[#1A1A1A]" />
        <Skeleton className="h-72 rounded-lg bg-[#1A1A1A]" />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-72 rounded-lg bg-[#1A1A1A]" />
        <Skeleton className="h-72 rounded-lg bg-[#1A1A1A]" />
      </div>
    </div>
  );
}
