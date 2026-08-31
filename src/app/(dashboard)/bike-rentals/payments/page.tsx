'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { PaymentKpiCards } from '@/components/payments/payment-kpi-cards';
import { PaymentTabs, type PaymentTab } from '@/components/payments/payment-tabs';
import { BikeRentalPayoutTable } from '@/components/bike-rentals/bike-rental-payout-table';
import { ProcessPayoutsModal } from '@/components/payments/process-payouts-modal';
import { SettlementTable } from '@/components/payments/settlement-table';
import { useBikeRentalPaymentKpis, useBikeRentalSettlements } from '@/hooks/use-bike-rental-payments';
import { useAdminBikeRentalPayouts } from '@/hooks/use-admin-bike-rentals';
import type { SettlementListItem } from '@/services/admin/payment.types';

export default function BikeRentalPaymentsPage() {
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

  const setTab = useCallback((tab: PaymentTab) => {
    setCurrentTab(tab);
    setPage(1);
    setStatus('ALL');
    setSearch('');
    setDebouncedSearch('');
  }, []);

  const filterParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: status !== 'ALL' ? status : undefined,
      page,
      limit: payoutLimit,
    }),
    [debouncedSearch, page, payoutLimit, status]
  );

  const { data: payoutData, loading: payoutLoading, refetch: refetchPayouts } = useAdminBikeRentalPayouts(
    filterParams,
    currentTab === 'settlement'
  );
  const {
    data: settlementData,
    loading: settlementLoading,
    refetch: refetchSettlements,
  } = useBikeRentalSettlements(
    page,
    settlementLimit,
    status,
    debouncedSearch,
    currentTab === 'settlement'
  );
  const { kpis, loading: kpiLoading, refresh: refreshKpis } = useBikeRentalPaymentKpis();

  const handleExport = useCallback(() => {
    if (currentTab === 'settlement') {
      if (!settlementData?.data) return;
      import('@/lib/export-excel').then(({ exportToExcel }) => {
        const rows = settlementData.data.map((s) => ({
          companyName: s.companyName,
          totalEarned: s.totalEarnedAllTime,
          totalPaidOut: s.totalAlreadyPaid,
          remainingBalance: Math.max(
            0,
            Number(s.totalPendingBalance || 0) - Number(s.availableToPayout || 0)
          ),
          lastPaidDate: s.lastPaidDate ? new Date(s.lastPaidDate).toLocaleDateString() : 'Never',
          nextSettlementDate: s.nextSettlementDate
            ? new Date(s.nextSettlementDate).toLocaleDateString()
            : 'Invalid Date',
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
            { key: 'nineDaySettlement', label: '9-Day Settlement' },
          ],
          'bike-rental-settlements'
        );
      });
    } else {
      if (!payoutData?.data) return;
      import('@/lib/export-excel').then(({ exportToExcel }) => {
        const rows = payoutData.data.map((t) => ({
          id: t.id,
          amount: t.amount,
          status: t.status,
          periodStart: t.periodStart,
          periodEnd: t.periodEnd,
          date: t.createdAt,
          supplier: t.supplier?.companyName,
        }));
        exportToExcel(
          rows,
          [
            { key: 'id', label: 'ID' },
            { key: 'supplier', label: 'Supplier' },
            { key: 'amount', label: 'Amount' },
            { key: 'status', label: 'Status' },
            { key: 'periodStart', label: 'Period Start' },
            { key: 'periodEnd', label: 'Period End' },
            { key: 'date', label: 'Created Date' },
          ],
          'bike-rental-payouts'
        );
      });
    }
  }, [currentTab, settlementData, payoutData]);

  const handlePayoutSuccess = () => {
    refetchPayouts();
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
          <h1 className="text-2xl font-bold text-white">Bike Rental Payments & Finance</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Track bike rental revenue, 10-day supplier settlements, and payout history
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
          <BikeRentalPayoutTable
            data={payoutData}
            loading={payoutLoading}
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
        module="RENTAL"
      />
    </div>
  );
}
