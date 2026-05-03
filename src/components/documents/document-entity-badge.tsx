'use client';

import type { DocumentEntityType } from '@/services/admin/document.types';

interface DocumentEntityBadgeProps {
  entityType: DocumentEntityType;
}

export function DocumentEntityBadge({ entityType }: DocumentEntityBadgeProps) {
  const config = entityType === 'driver'
    ? { label: 'Driver', className: 'bg-green-500/20 text-green-400 border-green-500/30' }
    : { label: 'Supplier', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
