'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { PaymentTypeBadge } from './payment-type-badge';
import { getPaymentStatusDisplay } from '@/services/admin/payment.types';
import type { UnifiedTransaction } from '@/services/admin/payment.types';

interface PaymentTableRowProps {
  txn: UnifiedTransaction;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }) +
    ' ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  );
}

export function PaymentTableRow({ txn }: PaymentTableRowProps) {
  const statusDisplay = getPaymentStatusDisplay(txn.status);

  return (
    <TableRow className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]/50">
      <TableCell>
        <span className="text-sm font-bold text-[#FACC15] font-mono">
          {txn.id}
        </span>
      </TableCell>
      <TableCell>
        <PaymentTypeBadge type={txn.type} />
      </TableCell>
      <TableCell className="text-sm text-white max-w-[200px] truncate">
        {txn.description}
      </TableCell>
      <TableCell className="text-sm font-medium text-white">
        &euro;{txn.amount.toFixed(2)}
      </TableCell>
      <TableCell>
        <span className={`text-sm ${statusDisplay.className}`}>
          {statusDisplay.label}
        </span>
      </TableCell>
      <TableCell className="text-sm text-[#9CA3AF]">{txn.method}</TableCell>
      <TableCell className="text-sm text-[#9CA3AF]">{txn.supplier}</TableCell>
      <TableCell className="text-sm font-medium text-green-400">
        &euro;{txn.commission.toFixed(2)}
      </TableCell>
      <TableCell className="text-sm text-[#9CA3AF]">
        {formatDate(txn.date)}
      </TableCell>
    </TableRow>
  );
}
