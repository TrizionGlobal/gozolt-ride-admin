'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { PenaltyStatusBadge } from './penalty-status-badge';
import type { PenaltyTransaction } from '@/services/admin/penalty.types';

interface PenaltyTableRowProps {
  penalty: PenaltyTransaction;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function PenaltyTableRow({ penalty }: PenaltyTableRowProps) {
  return (
    <TableRow className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]/50">
      <TableCell className="text-sm text-[#9CA3AF] font-mono">
        {penalty._displayId}
      </TableCell>
      <TableCell className="text-sm text-white">
        {penalty._typeName}
      </TableCell>
      <TableCell className="text-sm text-[#9CA3AF]">
        {penalty.entityType === 'SUPPLIER' ? 'Supplier' : 'Driver'}
      </TableCell>
      <TableCell className="text-sm text-[#9CA3AF] font-mono">
        {penalty._entityDisplayId}
      </TableCell>
      <TableCell className="text-sm text-white">
        {penalty._entityName}
      </TableCell>
      <TableCell>
        <PenaltyStatusBadge status={penalty.status} />
      </TableCell>
      <TableCell className="text-sm text-white">
        €{penalty.amount}
      </TableCell>
      <TableCell className="text-sm text-[#9CA3AF]">
        {formatDate(penalty.createdAt)}
      </TableCell>
    </TableRow>
  );
}
