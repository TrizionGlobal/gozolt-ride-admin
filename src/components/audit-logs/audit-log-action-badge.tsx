'use client';

import { ACTION_DISPLAY, ACTION_BADGE_COLORS } from '@/services/admin/audit-log.types';

interface AuditLogActionBadgeProps {
  action: string;
}

export function AuditLogActionBadge({ action }: AuditLogActionBadgeProps) {
  const label = ACTION_DISPLAY[action] ?? action;
  const colorClass = ACTION_BADGE_COLORS[action] ?? 'bg-gray-500/20 text-gray-400 border-gray-500/30';

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}
