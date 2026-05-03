'use client';

import { cn } from '@/lib/utils';
import { RideStatusBadge } from './ride-status-badge';
import type { RideListItem } from '@/services/admin/ride.types';

interface RideActiveCardProps {
  ride: RideListItem;
  isSelected: boolean;
  onSelect: () => void;
}

export function RideActiveCard({ ride, isSelected, onSelect }: RideActiveCardProps) {
  const userName = [ride.user.firstName, ride.user.lastName].filter(Boolean).join(' ') || 'Unknown';
  const driverName = ride.driver
    ? `${ride.driver.firstName} ${ride.driver.lastName}`
    : '—';
  const fare = ride.actualFare ?? ride.estimatedFare;

  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full text-left rounded-lg border p-3 transition-colors',
        isSelected
          ? 'border-[#FACC15]/60 bg-[#1A1A1A]'
          : 'border-[#2A2A2A] bg-[#141414] hover:border-[#3A3A3A]',
      )}
    >
      {/* Header: Ride ID + Status */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-[#FACC15] font-mono">{ride._displayId}</span>
        <RideStatusBadge status={ride.status} />
      </div>

      {/* Pickup */}
      <div className="flex items-center gap-2 mb-1">
        <span className="h-2 w-2 rounded-full bg-[#22C55E] shrink-0" />
        <span className="text-sm text-white truncate">{ride.pickupAddress}</span>
      </div>

      {/* Dropoff */}
      <div className="flex items-center gap-2 mb-2">
        <span className="h-2 w-2 rounded-full bg-[#EF4444] shrink-0" />
        <span className="text-sm text-white truncate">{ride.dropoffAddress}</span>
      </div>

      {/* User · Driver · Fare */}
      <div className="text-xs text-[#6B7280]">
        <span>{userName}</span>
        <span className="mx-1.5">&middot;</span>
        <span>{driverName}</span>
        <span className="mx-1.5">&middot;</span>
        <span className="text-white font-medium">&euro;{fare.toFixed(2)}</span>
      </div>
    </button>
  );
}
