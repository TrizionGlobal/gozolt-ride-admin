import { Skeleton } from '@/components/ui/skeleton';

export default function UserManagementLoading() {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-9 w-9 rounded-md bg-[#2A2A2A]" />
              <Skeleton className="h-5 w-14 rounded-full bg-[#2A2A2A]" />
            </div>
            <Skeleton className="h-8 w-20 mb-1 bg-[#2A2A2A]" />
            <Skeleton className="h-4 w-24 bg-[#2A2A2A]" />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Skeleton className="h-10 w-full bg-[#1A1A1A]" />

      {/* Table rows */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-[#1A1A1A]" />
        ))}
      </div>
    </div>
  );
}
