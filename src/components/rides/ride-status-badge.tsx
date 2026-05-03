'use client';

import { RideStatus } from '@/types';
import { getRideStatusDisplay } from '@/services/admin/ride.types';

interface RideStatusBadgeProps {
  status: RideStatus;
  isDisputed?: boolean;
}

export function RideStatusBadge({ status, isDisputed }: RideStatusBadgeProps) {
  if (isDisputed) {
    return (
      <span className="inline-flex items-center rounded-full border border-red-700/30 bg-red-900/40 px-2 py-0.5 text-xs font-medium text-red-400">
        Disputed
      </span>
    );
  }

  const { label, className } = getRideStatusDisplay(status);
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
