'use client';

import type { VehicleStatus } from '@/types';
import { getVehicleStatusDisplay } from '@/services/admin/vehicle.types';
import { cn } from '@/lib/utils';

interface VehicleStatusBadgeProps {
  status: VehicleStatus;
}

export function VehicleStatusBadge({ status }: VehicleStatusBadgeProps) {
  const display = getVehicleStatusDisplay(status);

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        display.className,
      )}
    >
      {display.label}
    </span>
  );
}
