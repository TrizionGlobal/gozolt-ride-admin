'use client';

import { ServerSideTable, ColumnDef } from '@/components/ui/server-side-table';
import type { SettlementListResponse, SettlementListItem } from '@/services/admin/payment.types';

interface SettlementTableProps {
  data: SettlementListResponse | null;
  loading: boolean;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onPaySupplier: (supplier: SettlementListItem) => void;
}

export function SettlementTable({ data, loading, page, limit, onPageChange, onLimitChange, onPaySupplier }: SettlementTableProps) {
  const columns: ColumnDef<SettlementListItem>[] = [
    {
      key: 'companyName',
      title: 'Company Name',
      dataIndex: 'companyName',
    },
    {
      key: 'totalEarnedAllTime',
      title: 'Total Earned',
      render: (row) => <span className="text-white text-sm">&euro;{Number(row.totalEarnedAllTime || 0).toFixed(2)}</span>,
    },
    {
      key: 'totalAlreadyPaid',
      title: 'Total Paid Out',
      render: (row) => <span className="text-white text-sm">&euro;{Number(row.totalAlreadyPaid || 0).toFixed(2)}</span>,
    },
    {
      key: 'remainingBalance',
      title: 'Remaining Balance',
      render: (row) => <span className="text-[#FACC15] font-medium text-sm">&euro;{Math.max(0, Number(row.totalPendingBalance || 0) - Number(row.availableToPayout || 0)).toFixed(2)}</span>,
    },
    {
      key: 'lastPaidDate',
      title: 'Last Paid Date',
      render: (row) => <span className="text-[#9CA3AF] text-sm">{row.lastPaidDate ? new Date(row.lastPaidDate).toLocaleDateString() : 'Never'}</span>,
    },
    {
      key: 'nextSettlementDate',
      title: 'Next Settlement Date',
      render: (row) => (
        <span className={row.isPayable ? "text-green-400 font-medium text-sm" : "text-[#9CA3AF] text-sm"}>
          {row.nextSettlementDate ? new Date(row.nextSettlementDate).toLocaleDateString() : 'Invalid Date'}
        </span>
      ),
    },
    {
      key: '9DaySettlement',
      title: '9-Day Settlement',
      render: (row) => <span className="text-white text-sm">&euro;{Number(row.availableToPayout || 0).toFixed(2)}</span>,
    },
    {
      key: 'action',
      title: 'Action',
      className: 'text-center',
      render: (row) => (
        <button
          onClick={(e) => { e.stopPropagation(); onPaySupplier(row); }}
          disabled={!row.isPayable || row.availableToPayout <= 0}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${row.isPayable && row.availableToPayout > 0
              ? 'bg-[#FACC15] text-black hover:bg-[#E5B800]'
              : 'bg-[#2A2A2A] text-[#6B7280] cursor-not-allowed'
            }`}
        >
          Pay Settlement
        </button>
      ),
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
        onLimitChange={onLimitChange || (() => { })}
        emptyText="No suppliers found."
      />
    </div>
  );
}
