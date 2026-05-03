'use client';

import { ADMIN_ROLE_DISPLAY, ADMIN_ROLE_COLOR, type AdminRole } from '@/services/admin/settings.types';

interface AdminRoleBadgeProps {
  role: AdminRole;
}

export function AdminRoleBadge({ role }: AdminRoleBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ADMIN_ROLE_COLOR[role]}`}
    >
      {ADMIN_ROLE_DISPLAY[role]}
    </span>
  );
}
