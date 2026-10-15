'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Download, CreditCard } from 'lucide-react';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { Button } from '@/components/ui/button';
import { PaymentKpiCards } from '@/components/payments/payment-kpi-cards';
import { PaymentTabs, type PaymentTab } from '@/components/payments/payment-tabs';
import { PaymentTable } from '@/components/payments/payment-table';
import { ProcessPayoutsModal } from '@/components/payments/process-payouts-modal';
import { SettlementTable } from '@/components/payments/settlement-table';
import { useTransactions, usePaymentKpis, useSettlements } from '@/hooks/use-payments';
import type { TransactionFilterParams, TransactionType, SettlementListItem } from '@/services/admin/payment.types';
import { toast } from 'sonner';

const TAB_TYPE_MAP: Record<PaymentTab, TransactionType | undefined> = {
  ride: 'ride',
  payout: 'payout',
  refund: 'refund',
  tip: 'tip',
  settlement: undefined,
};

export default function PaymentsPage() {
  const [currentTab, setCurrentTab] = useState<PaymentTab>('settlement');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [settlementLimit, setSettlementLimit] = useState(20);
  const [payoutLimit, setPayoutLimit] = useState(20);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string>('ALL');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const setTab = useCallback(
    (tab: PaymentTab) => {
      setCurrentTab(tab);
      setPage(1);
      setStatus('ALL');
      setSearch('');
      setDebouncedSearch('');
    },
    [],
  );

  const filterParams = useMemo<TransactionFilterParams>(
    () => ({
      type: TAB_TYPE_MAP[currentTab],
      search: debouncedSearch || undefined,
      status: status !== 'ALL' ? status : undefined,
      page,
      limit: payoutLimit,
    }),
    [currentTab, debouncedSearch, page, payoutLimit, status],
  );

  const { data, loading, refetch } = useTransactions(filterParams, currentTab !== 'settlement');
  const { data: settlementData, loading: settlementLoading, refetch: refetchSettlements } = useSettlements(page, settlementLimit, status, debouncedSearch, currentTab === 'settlement');
  const { kpis, loading: kpiLoading, refresh: refreshKpis } = usePaymentKpis();
  
  const handleExport = useCallback(() => {
    if (currentTab === 'settlement') {
      if (!settlementData?.data) return;
      import('@/lib/export-excel').then(({ exportToExcel }) => {
        const rows = settlementData.data.map((s) => ({
          companyName: s.companyName,
          totalEarned: s.totalEarnedAllTime,
          totalPaidOut: s.totalAlreadyPaid,
          remainingBalance: Math.max(0, Number(s.totalPendingBalance || 0) - Number(s.availableToPayout || 0)),
          lastPaidDate: s.lastPaidDate ? new Date(s.lastPaidDate).toLocaleDateString() : 'Never',
          nextSettlementDate: s.nextSettlementDate ? new Date(s.nextSettlementDate).toLocaleDateString() : 'Invalid Date',
          nineDaySettlement: s.availableToPayout,
        }));
        exportToExcel(
          rows, 
          [
            { key: 'companyName', label: 'Company Name' },
            { key: 'totalEarned', label: 'Total Earned' },
            { key: 'totalPaidOut', label: 'Total Paid Out' },
            { key: 'remainingBalance', label: 'Remaining Balance' },
            { key: 'lastPaidDate', label: 'Last Paid Date' },
            { key: 'nextSettlementDate', label: 'Next Settlement Date' },
            { key: 'nineDaySettlement', label: '9-Day Settlement' }
          ], 
          'settlements'
        );
      });
    } else {
      if (!data?.data) return;
      import('@/lib/export-excel').then(({ exportToExcel }) => {
        const rows = data.data.map((t) => ({
          id: t.id,
          type: t.type,
          description: t.description,
          amount: t.amount,
          commission: t.commission,
          status: t.status,
          date: t.date || (t as any).createdAt || new Date().toISOString(),
          supplier: t.supplier,
          method: t.method,
        }));
        exportToExcel(
          rows,
          [
            { key: 'id', label: 'ID' },
            { key: 'type', label: 'Type' },
            { key: 'description', label: 'Description' },
            { key: 'amount', label: 'Amount' },
            { key: 'commission', label: 'Commission' },
            { key: 'status', label: 'Status' },
            { key: 'date', label: 'Date' },
            { key: 'supplier', label: 'Supplier' },
            { key: 'method', label: 'Method' }
          ],
          'payments'
        );
      });
    }
  }, [currentTab, settlementData, data]);


  const handlePayoutSuccess = () => {
    refetch();
    refetchSettlements();
    refreshKpis();
  };

  const handlePaySupplier = (supplier: SettlementListItem) => {
    setSelectedSupplierId(supplier.id);
    setPayoutOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Payments & Finance</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Track revenue, payouts, and refunds
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <PaymentKpiCards kpis={kpis} loading={kpiLoading} />

      {/* Tabs + Search */}
      <PaymentTabs
        activeTab={currentTab}
        onTabChange={setTab}
        search={search}
        onSearchChange={(v: string) => setSearch(sanitizeSearchQuery(v))}
        status={status}
        onStatusChange={(v: string) => { setStatus(v); setPage(1); }}
        onExport={handleExport}
      />

      {/* Table */}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414]">
        {currentTab === 'settlement' ? (
          <SettlementTable
            data={settlementData}
            loading={settlementLoading}
            page={page}
            limit={settlementLimit}
            onPageChange={setPage}
            onLimitChange={setSettlementLimit}
            onPaySupplier={handlePaySupplier}
          />
        ) : (
          <PaymentTable
            data={data}
            loading={loading}
            page={page}
            limit={payoutLimit}
            onPageChange={setPage}
            onLimitChange={setPayoutLimit}
          />
        )}
      </div>

      {/* Process Payouts Modal */}
      <ProcessPayoutsModal
        open={payoutOpen}
        onOpenChange={(open) => {
          setPayoutOpen(open);
          if (!open) setSelectedSupplierId(undefined);
        }}
        onSuccess={handlePayoutSuccess}
        preselectedSupplierId={selectedSupplierId}
      />
    </div>
  );
}
