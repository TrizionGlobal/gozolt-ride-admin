'use client';

import { cn } from '@/lib/utils';

interface DriverDocsBadgeProps {
  status: 'verified' | 'pending' | 'expired';
}

const docsColors: Record<string, string> = {
  verified: 'text-green-400',
  pending: 'text-yellow-400',
  expired: 'text-red-400',
};

export function DriverDocsBadge({ status }: DriverDocsBadgeProps) {
  return (
    <span className={cn('text-xs font-medium', docsColors[status])}>
      {status}
    </span>
  );
}
