'use client';

import { DocumentStatus } from '@/types';
import { getDocumentStatusDisplay } from '@/services/admin/document.types';

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
}

export function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  const { label, className } = getDocumentStatusDisplay(status);
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
