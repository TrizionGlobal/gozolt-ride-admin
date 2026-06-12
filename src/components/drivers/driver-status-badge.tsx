'use client';

import type { DriverStatus } from '@/types';
import { getDriverStatusDisplay } from '@/services/admin/driver.types';
import { cn } from '@/lib/utils';

interface DriverStatusBadgeProps {
  status: DriverStatus;
  isOnline: boolean;
  hasVehicle?: boolean;
}

export function DriverStatusBadge({ status, isOnline, hasVehicle }: DriverStatusBadgeProps) {
  const display = getDriverStatusDisplay(status, isOnline, hasVehicle);

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
