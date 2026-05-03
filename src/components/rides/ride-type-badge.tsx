'use client';

import type { VehicleType } from '@/types';
import { getRideTypeDisplay } from '@/services/admin/ride.types';

interface RideTypeBadgeProps {
  type: VehicleType;
}

export function RideTypeBadge({ type }: RideTypeBadgeProps) {
  const { label, className } = getRideTypeDisplay(type);
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
