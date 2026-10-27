'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { PaymentKpiCards } from '@/components/payments/payment-kpi-cards';
import { PaymentTabs, type PaymentTab } from '@/components/payments/payment-tabs';
import { AirportTransferPaymentTable } from '@/components/airport-transfers/payments/airport-transfer-payment-table';
import { AirportTransferPayoutModal } from '@/components/airport-transfers/payments/airport-transfer-payout-modal';
import { AirportTransferSettlementTable } from '@/components/airport-transfers/payments/airport-transfer-settlement-table';
import {
  useAirportTransferTransactions,
  useAirportTransferPaymentKpis,
  useAirportTransferSettlements,
} from '@/hooks/use-airport-transfer-payments';
import type { TransactionFilterParams, TransactionType, SettlementListItem } from '@/services/admin/payment.types';

const TAB_TYPE_MAP: Record<PaymentTab, TransactionType | undefined> = {
  ride: 'ride',
  payout: 'payout',
  refund: 'refund',
  tip: 'tip',
  settlement: undefined,
};

export default function AdminAirportTransfersPaymentsPage() {
  const [currentTab, setCurrentTab] = useState<PaymentTab>('settlement');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [settlementLimit, setSettlementLimit] = useState(20);
  const [payoutLimit, setPayoutLimit] = useState(20);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | undefined>(undefined);
  const [selectedSupplierName, setSelectedSupplierName] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string>('ALL');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const setTab = useCallback((tab: PaymentTab) => {
    setCurrentTab(tab);
    setPage(1);
    setStatus('ALL');
    setSearch('');
    setDebouncedSearch('');
  }, []);

  const filterParams = useMemo<TransactionFilterParams>(
    () => ({
      type: TAB_TYPE_MAP[currentTab],
      search: debouncedSearch || undefined,
      status: status !== 'ALL' ? status : undefined,
      page,
      limit: payoutLimit,
    }),
    [currentTab, debouncedSearch, page, payoutLimit, status]
  );

  const { data, loading, refetch } = useAirportTransferTransactions(filterParams, currentTab !== 'settlement');
  const { data: settlementData, loading: settlementLoading, refetch: refetchSettlements } = useAirportTransferSettlements(
    page,
    settlementLimit,
    status,
    debouncedSearch,
    currentTab === 'settlement'
  );
  const { kpis, loading: kpiLoading, refresh: refreshKpis } = useAirportTransferPaymentKpis();

  const handleExport = useCallback(() => {
    if (currentTab === 'settlement') {
      if (!settlementData?.data) return;
      import('@/lib/export-excel').then(({ exportToExcel }) => {
        const rows = settlementData.data.map((s: any) => ({
          companyName: s.companyName,
          totalEarned: s.totalGrossEarned ?? s.totalEarnedAllTime,
          totalPaidOut: s.totalAlreadyPaid,
          cancellationFees: s.totalCancellations ?? s.totalPenaltyEarned,
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
            { key: 'cancellationFees', label: 'Cancellation Fees' },
            { key: 'totalPaidOut', label: 'Total Paid Out' },
            { key: 'remainingBalance', label: 'Remaining Balance' },
            { key: 'lastPaidDate', label: 'Last Paid Date' },
            { key: 'nextSettlementDate', label: 'Next Settlement Date' },
            { key: 'nineDaySettlement', label: '9-Day Settlement' },
          ],
          'airport-transfer-settlements'
        );
      });
    } else {
      if (!data?.data) return;
      import('@/lib/export-excel').then(({ exportToExcel }) => {
        const rows = data.data.map((t: any) => ({
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
            { key: 'method', label: 'Method' },
          ],
          'airport-transfer-payments'
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
    setSelectedSupplierName(supplier.companyName);
    setPayoutOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-[#FCD223]" />
            Airport Transfer Payments & Settlements
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Track revenue, supplier payouts, and 9-day settlement disbursements
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
        onStatusChange={(v: string) => {
          setStatus(v);
          setPage(1);
        }}
        onExport={handleExport}
      />

      {/* Table */}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414]">
        {currentTab === 'settlement' ? (
          <AirportTransferSettlementTable
            data={settlementData}
            loading={settlementLoading}
            page={page}
            limit={settlementLimit}
            onPageChange={setPage}
            onLimitChange={setSettlementLimit}
            onPaySupplier={handlePaySupplier}
          />
        ) : (
          <AirportTransferPaymentTable
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
      <AirportTransferPayoutModal
        open={payoutOpen}
        onOpenChange={(open) => {
          setPayoutOpen(open);
          if (!open) {
            setSelectedSupplierId(undefined);
            setSelectedSupplierName(undefined);
          }
        }}
        onSuccess={handlePayoutSuccess}
        preselectedSupplierId={selectedSupplierId}
        preselectedSupplierName={selectedSupplierName}
      />
    </div>
  );
}
