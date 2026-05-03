import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-40 bg-[#1A1A1A]" />
        <Skeleton className="h-4 w-72 bg-[#1A1A1A] mt-2" />
      </div>

      {/* Card */}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414]">
        {/* Tab bar */}
        <div className="flex gap-4 border-b border-[#2A2A2A] px-4 py-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-20 bg-[#1A1A1A]" />
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full bg-[#1A1A1A]" />
          ))}
        </div>
      </div>
    </div>
  );
}
