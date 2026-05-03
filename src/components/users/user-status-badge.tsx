'use client';

import type { UserStatus } from '@/types';
import { getUserStatusDisplay } from '@/services/admin/user.types';
import { cn } from '@/lib/utils';

interface UserStatusBadgeProps {
  status: UserStatus;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const display = getUserStatusDisplay(status);

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
