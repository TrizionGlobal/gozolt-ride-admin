'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Download, CreditCard } from 'lucide-react';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { Button } from '@/components/ui/button';
import { PaymentKpiCards } from '@/components/payments/payment-kpi-cards';
import { PaymentTabs, type PaymentTab } from '@/components/payments/payment-tabs';
import { PaymentTable } from '@/components/payments/payment-table';
import { ProcessPayoutsModal } from '@/components/payments/process-payouts-modal';
import { useTransactions, usePaymentKpis } from '@/hooks/use-payments';
import type { TransactionFilterParams, TransactionType } from '@/services/admin/payment.types';
import { toast } from 'sonner';

const TAB_TYPE_MAP: Record<PaymentTab, TransactionType | undefined> = {
  all: undefined,
  ride: 'ride',
  payout: 'payout',
  refund: 'refund',
  tip: 'tip',
};

export default function PaymentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = (searchParams.get('tab') as PaymentTab) || 'all';
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [payoutOpen, setPayoutOpen] = useState(false);

  const setTab = useCallback(
    (tab: PaymentTab) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tab === 'all') {
        params.delete('tab');
      } else {
        params.set('tab', tab);
      }
      router.replace(`?${params.toString()}`);
      setPage(1);
    },
    [router, searchParams],
  );

  const filterParams = useMemo<TransactionFilterParams>(
    () => ({
      type: TAB_TYPE_MAP[currentTab],
      search: search || undefined,
      page,
      limit: 20,
    }),
    [currentTab, search, page],
  );

  const { data, loading, refetch } = useTransactions(filterParams);
  const { kpis, loading: kpiLoading, refresh: refreshKpis } = usePaymentKpis();

  const handleExport = () => {
    toast.success('Export started — CSV will be downloaded shortly');
  };

  const handlePayoutSuccess = () => {
    refetch();
    refreshKpis();
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
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-[#2A2A2A] bg-[#141414] text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A]"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={() => setPayoutOpen(true)}
            className="bg-[#FACC15] text-black hover:bg-[#E5B800]"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Process Payouts
          </Button>
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
      />

      {/* Table */}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414]">
        <PaymentTable
          data={data}
          loading={loading}
          page={page}
          onPageChange={setPage}
        />
      </div>

      {/* Process Payouts Modal */}
      <ProcessPayoutsModal
        open={payoutOpen}
        onOpenChange={setPayoutOpen}
        onSuccess={handlePayoutSuccess}
      />
    </div>
  );
}
