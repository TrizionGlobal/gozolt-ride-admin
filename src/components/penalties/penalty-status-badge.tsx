'use client';

import { cn } from '@/lib/utils';
import { PENALTY_STATUS_STYLES } from '@/services/admin/penalty.types';
import type { PenaltyStatus } from '@/services/admin/penalty.types';

interface PenaltyStatusBadgeProps {
  status: PenaltyStatus;
}

export function PenaltyStatusBadge({ status }: PenaltyStatusBadgeProps) {
  const style = PENALTY_STATUS_STYLES[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        style.className,
      )}
    >
      {style.label}
    </span>
  );
}
