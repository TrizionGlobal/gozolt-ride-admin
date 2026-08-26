'use client';

import { ServerSideTable, type ColumnDef } from '@/components/ui/server-side-table';
import { Badge } from '@/components/ui/badge';
import { formatStatusLabel } from '@/lib/utils';
import type { PaginatedResponse } from '@/types';
import type { AdminCarRentalPayout } from '@/hooks/use-admin-car-rentals';

interface CarRentalPayoutTableProps {
  data: PaginatedResponse<AdminCarRentalPayout> | undefined | null;
  loading: boolean;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

function formatDate(isoStr: string | null | undefined): string {
  if (!isoStr) return '—';
  const date = new Date(isoStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function CarRentalPayoutTable({
  data,
  loading,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: CarRentalPayoutTableProps) {
  const columns: ColumnDef<AdminCarRentalPayout>[] = [
    {
      key: 'createdAt',
      title: 'DATE',
      render: (row) => (
        <span className="text-sm text-[#9CA3AF] font-mono">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: 'supplier',
      title: 'SUPPLIER',
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">
            {row.supplier?.companyName || 'N/A'}
          </span>
          <span className="text-xs text-[#6B7280]">{row.supplier?.email}</span>
        </div>
      ),
    },
    {
      key: 'period',
      title: 'SETTLEMENT PERIOD',
      render: (row) => (
        <span className="text-sm text-[#9CA3AF]">
          {formatDate(row.periodStart)} to {formatDate(row.periodEnd)}
        </span>
      ),
    },
    {
      key: 'amount',
      title: 'AMOUNT',
      render: (row) => (
        <span className="text-sm font-semibold text-[#22C55E]">
          €{Number(row.amount).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'STATUS',
      render: (row) => {
        let badgeClass = 'border-gray-500/20 bg-gray-500/10 text-gray-400';
        if (row.status === 'COMPLETED') badgeClass = 'border-[#22C55E]/20 bg-[#22C55E]/10 text-[#22C55E]';
        if (row.status === 'PENDING') badgeClass = 'border-[#FACC15]/20 bg-[#FACC15]/10 text-[#FACC15]';
        if (row.status === 'PROCESSING') badgeClass = 'border-[#3B82F6]/20 bg-[#3B82F6]/10 text-[#3B82F6]';
        if (row.status === 'FAILED') badgeClass = 'border-[#EF4444]/20 bg-[#EF4444]/10 text-[#EF4444]';

        return (
          <Badge className={`px-2.5 py-0.5 text-xs font-semibold capitalize ${badgeClass}`}>
            {formatStatusLabel(row.status)}
          </Badge>
        );
      },
    },
  ];

  return (
    <ServerSideTable
      columns={columns}
      data={data?.data || []}
      isLoading={loading}
      page={page}
      limit={limit}
      total={data?.meta?.total || 0}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      emptyText="No rental payouts found."
    />
  );
}
