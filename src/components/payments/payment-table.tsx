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
      render: (row, expanded) => {
        const hasDetails = row.type === 'payout' && !!row.details;
        return (
          <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
            {formatDate(row.date || (row as any).createdAt || new Date().toISOString())}
            {hasDetails && (
              expanded ? <ChevronDown className="h-4 w-4 text-[#6B7280]" /> : <ChevronRight className="h-4 w-4 text-[#6B7280]" />
            )}
          </div>
        );
      },
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
      key: 'method',
      title: 'Method',
      render: (row) => <span className="text-sm text-[#9CA3AF]">{row.method}</span>,
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (row) => <span className="text-sm font-medium text-white">&euro;{Number(row.amount || 0).toFixed(2)}</span>,
    },
    {
      key: 'commission',
      title: 'Commission',
      render: (row) => <span className="text-sm font-medium text-green-400">&euro;{Number((row as any).platformFee ?? row.commission ?? 0).toFixed(2)}</span>,
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

  const renderExpandedRow = (txn: UnifiedTransaction) => {
    if (txn.type !== 'payout' || !txn.details) return null;
    return (
      <div className="p-4 ml-8 flex flex-col md:flex-row gap-6 items-start justify-between">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <h4 className="text-white font-semibold text-sm">Settlement Receipt</h4>
            <p className="text-xs text-[#9CA3AF]">Stripe Transfer ID: <span className="font-mono text-[#FACC15]">{txn.details?.transferId || 'N/A'}</span></p>
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-[#6B7280] text-xs">Gross Settled Revenue</p>
            <p className="text-white font-medium">&euro;{Number(txn.details?.totalSettledEarned || 0).toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[#6B7280] text-xs">Past Payouts</p>
            <p className="text-white font-medium">&euro;{Number(txn.details?.totalAlreadyPaid || 0).toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[#6B7280] text-xs">Driver Cash Kept</p>
            <p className="text-red-400 font-medium">&euro;{Number(txn.details?.totalCashCollected || 0).toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[#6B7280] text-xs">Remaining Pending</p>
            <p className="text-[#FACC15] font-medium">&euro;{Number(txn.details?.remainingPendingAfterThis || 0).toFixed(2)}</p>
          </div>
        </div>
      </div>
    );
  };

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
        renderExpandedRow={(row) => (row.type === 'payout' && !!row.details) ? renderExpandedRow(row) : undefined}
      />
    </div>
  );
}
