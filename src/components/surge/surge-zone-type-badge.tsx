'use client';

import type { SurgeZoneType } from '@/services/admin/surge.types';
import { getZoneTypeDisplay } from '@/services/admin/surge.types';

interface SurgeZoneTypeBadgeProps {
  type: SurgeZoneType;
}

export function SurgeZoneTypeBadge({ type }: SurgeZoneTypeBadgeProps) {
  const display = getZoneTypeDisplay(type);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${display.className}`}
    >
      {display.label}
    </span>
  );
}
