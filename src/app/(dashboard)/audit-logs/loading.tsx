import { Skeleton } from '@/components/ui/skeleton';

export default function AuditLogsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36 bg-[#1A1A1A]" />
          <Skeleton className="h-4 w-72 bg-[#1A1A1A]" />
        </div>
        <Skeleton className="h-6 w-28 bg-[#1A1A1A]" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-32 bg-[#1A1A1A]" />
        <Skeleton className="h-9 w-32 bg-[#1A1A1A]" />
        <Skeleton className="h-9 w-32 bg-[#1A1A1A]" />
        <div className="flex-1" />
        <Skeleton className="h-9 w-36 bg-[#1A1A1A]" />
        <Skeleton className="h-9 w-36 bg-[#1A1A1A]" />
        <Skeleton className="h-9 w-28 bg-[#1A1A1A]" />
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
