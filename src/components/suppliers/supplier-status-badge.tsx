'use client';

import { CheckCircle2, Clock, Ban, XCircle } from 'lucide-react';
import { SupplierStatus } from '@/types';
import { STATUS_DISPLAY } from '@/services/admin/supplier.types';
import { cn } from '@/lib/utils';

interface SupplierStatusBadgeProps {
  status: SupplierStatus;
}

const statusConfig: Record<SupplierStatus, { icon: typeof CheckCircle2; className: string }> = {
  [SupplierStatus.ACTIVE]: {
    icon: CheckCircle2,
    className: 'bg-green-900/40 text-green-400 border-green-800',
  },
  [SupplierStatus.PENDING_VERIFICATION]: {
    icon: Clock,
    className: 'bg-yellow-900/40 text-yellow-400 border-yellow-800',
  },
  [SupplierStatus.SUSPENDED]: {
    icon: Ban,
    className: 'bg-red-900/40 text-red-400 border-red-800',
  },
  [SupplierStatus.REJECTED]: {
    icon: XCircle,
    className: 'bg-red-900/40 text-red-400 border-red-800',
  },
};

export function SupplierStatusBadge({ status }: SupplierStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.className,
      )}
    >
      <Icon className="h-3 w-3" />
      {STATUS_DISPLAY[status]}
    </span>
  );
}
