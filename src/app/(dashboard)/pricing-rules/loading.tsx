import { Skeleton } from '@/components/ui/skeleton';

export default function PricingRulesLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-72 bg-[#1A1A1A]" />
        <Skeleton className="h-4 w-96 bg-[#1A1A1A]" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80 rounded-lg bg-[#1A1A1A]" />
        <Skeleton className="h-48 rounded-lg bg-[#1A1A1A]" />
      </div>
    </div>
  );
}
