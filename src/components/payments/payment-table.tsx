'use client';

import { ServerSideTable, ColumnDef } from '@/components/ui/server-side-table';
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getPaymentStatusDisplay } from '@/services/admin/payment.types';
import type { TransactionListResponse, UnifiedTransaction } from '@/services/admin/payment.types';

interface PaymentTableProps {
  data: TransactionListResponse | null;
  loading: boolean;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
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

export function PaymentTable({
  data,
  loading,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: PaymentTableProps) {
  const columns: ColumnDef<UnifiedTransaction>[] = [
    {
      key: 'date',
      title: 'Date',
      render: (row) => (
        <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
          {formatDate(row.date || (row as any).createdAt || new Date().toISOString())}
        </div>
      ),
    },
    {
      key: 'description',
      title: 'Description',
      render: (row) => <span className="text-sm text-white max-w-[200px] block truncate">{row.description || 'Ride Payment'}</span>,
    },
    {
      key: 'supplier',
      title: 'Supplier',
      render: (row) => <span className="text-sm text-[#9CA3AF]">{row.supplier || 'N/A'}</span>,
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (row) => <span className="text-sm font-medium text-white">&euro;{Number(row.amount || 0).toFixed(2)}</span>,
    },
    {
      key: 'status',
      title: 'Status',
      render: (row) => {
        const statusDisplay = getPaymentStatusDisplay(row.status);
        return <span className={`text-sm ${statusDisplay.className}`}>{statusDisplay.label}</span>;
      },
    },
  ];

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] overflow-hidden">
      <ServerSideTable
        columns={columns}
        data={data?.data || []}
        isLoading={loading}
        page={page}
        limit={limit}
        total={data?.meta?.total || 0}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange || (() => {})}
        emptyText="No transactions found."
      />
    </div>
  );
}
