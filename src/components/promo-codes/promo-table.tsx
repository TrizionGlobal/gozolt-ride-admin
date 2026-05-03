'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PromoTableRow } from './promo-table-row';
import type { PromoCode } from '@/services/admin/promo.types';

interface PromoTableProps {
  codes: PromoCode[];
  loading: boolean;
  onEdit: (promo: PromoCode) => void;
  onToggle: (id: string, isActive: boolean) => void;
}

export function PromoTable({ codes, loading, onEdit, onToggle }: PromoTableProps) {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-[#1A1A1A]" />
        ))}
      </div>
    );
  }

  if (codes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-[#6B7280] text-sm">
        No promo codes found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-[#2A2A2A] hover:bg-transparent">
          <TableHead className="text-[#9CA3AF] text-xs font-medium">Code</TableHead>
          <TableHead className="text-[#9CA3AF] text-xs font-medium">Type</TableHead>
          <TableHead className="text-[#9CA3AF] text-xs font-medium">Value</TableHead>
          <TableHead className="text-[#9CA3AF] text-xs font-medium">Usage</TableHead>
          <TableHead className="text-[#9CA3AF] text-xs font-medium">Valid Until</TableHead>
          <TableHead className="text-[#9CA3AF] text-xs font-medium">Status</TableHead>
          <TableHead className="text-[#9CA3AF] text-xs font-medium w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {codes.map((promo) => (
          <PromoTableRow
            key={promo.id}
            promo={promo}
            onEdit={onEdit}
            onToggle={onToggle}
          />
        ))}
      </TableBody>
    </Table>
  );
}
