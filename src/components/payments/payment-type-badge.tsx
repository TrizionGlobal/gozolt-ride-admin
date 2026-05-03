'use client';

import type { TransactionType } from '@/services/admin/payment.types';
import { getTransactionTypeDisplay } from '@/services/admin/payment.types';

interface PaymentTypeBadgeProps {
  type: TransactionType;
}

export function PaymentTypeBadge({ type }: PaymentTypeBadgeProps) {
  const display = getTransactionTypeDisplay(type);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${display.className}`}
    >
      {display.label}
    </span>
  );
}
