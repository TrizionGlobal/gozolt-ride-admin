import { Skeleton } from '@/components/ui/skeleton';

export default function RideManagementLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-56 bg-[#1A1A1A]" />
        <Skeleton className="h-4 w-64 mt-2 bg-[#1A1A1A]" />
      </div>

      {/* Tabs */}
      <Skeleton className="h-10 w-full bg-[#1A1A1A]" />

      {/* Live View skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        <Skeleton className="h-80 rounded-lg bg-[#1A1A1A]" />
        <Skeleton className="h-80 rounded-lg bg-[#1A1A1A]" />
      </div>

      {/* Detail skeleton */}
      <Skeleton className="h-48 w-full rounded-lg bg-[#1A1A1A]" />
    </div>
  );
}
