'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { RideActiveCard } from './ride-active-card';
import type { RideListItem } from '@/services/admin/ride.types';

interface RideActiveListProps {
  rides: RideListItem[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function RideActiveList({ rides, loading, selectedId, onSelect }: RideActiveListProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-lg bg-[#1A1A1A]" />
        ))}
      </div>
    );
  }

  if (rides.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-[#6B7280]">
        No active rides
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-y-auto max-h-[400px] pr-1">
      {rides.map((ride) => (
        <RideActiveCard
          key={ride.id}
          ride={ride}
          isSelected={selectedId === ride.id}
          onSelect={() => onSelect(ride.id)}
        />
      ))}
    </div>
  );
}
