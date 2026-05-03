import { Skeleton } from '@/components/ui/skeleton';

export default function SurgeConfigLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-56 bg-[#1A1A1A]" />
        <Skeleton className="h-4 w-72 bg-[#1A1A1A]" />
      </div>

      {/* Row 1: Map + Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        <Skeleton className="h-72 rounded-lg bg-[#1A1A1A]" />
        <Skeleton className="h-72 rounded-lg bg-[#1A1A1A]" />
      </div>

      {/* Row 2: Detail */}
      <Skeleton className="h-56 rounded-lg bg-[#1A1A1A]" />

      {/* Row 3: Chart + Edit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-64 rounded-lg bg-[#1A1A1A]" />
        <Skeleton className="h-64 rounded-lg bg-[#1A1A1A]" />
      </div>

      {/* Row 4: Service map + Global rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-64 rounded-lg bg-[#1A1A1A]" />
        <Skeleton className="h-64 rounded-lg bg-[#1A1A1A]" />
      </div>

      {/* Row 5: Zone list + Overrides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-60 rounded-lg bg-[#1A1A1A]" />
        <Skeleton className="h-48 rounded-lg bg-[#1A1A1A]" />
      </div>
    </div>
  );
}
