'use client';

import { cn } from '@/lib/utils';
import { DISPUTE_STATUS_STYLES, type DisputeStatus } from '@/services/admin/dispute.types';

interface DisputeStatusBadgeProps {
  status: DisputeStatus;
}

export function DisputeStatusBadge({ status }: DisputeStatusBadgeProps) {
  const style = DISPUTE_STATUS_STYLES[status];
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
