import { Skeleton } from '@/components/ui/skeleton';

export default function SupplierManagementLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64 bg-[#1A1A1A]" />
        <Skeleton className="h-4 w-48 mt-2 bg-[#1A1A1A]" />
      </div>
      <Skeleton className="h-10 w-full bg-[#1A1A1A]" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-[#1A1A1A]" />
        ))}
      </div>
    </div>
  );
}
