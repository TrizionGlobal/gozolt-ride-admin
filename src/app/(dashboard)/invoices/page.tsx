'use client';

import { useState, useMemo } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  Coins,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useInvoices } from '@/hooks/use-invoices';
import { getInvoiceStatusDisplay } from '@/services/admin/invoice.types';
import type { InvoiceStatus, InvoiceFilterParams } from '@/services/admin/invoice.types';
import { toast } from 'sonner';

type StatusTab = 'ALL' | InvoiceStatus;

const STATUS_TABS: { key: StatusTab; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'DRAFT', label: 'Draft' },
  { key: 'ISSUED', label: 'Issued' },
  { key: 'PAID', label: 'Paid' },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-MT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

function formatCurrencyWhole(amount: number) {
  return new Intl.NumberFormat('en-MT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPeriod(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${monthNames[s.getMonth()]} ${s.getFullYear()} - ${monthNames[e.getMonth()]} ${e.getFullYear()}`;
}

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState<StatusTab>('ALL');
  const [page, setPage] = useState(1);

  const filterParams = useMemo<InvoiceFilterParams>(
    () => ({
      status: activeTab === 'ALL' ? undefined : activeTab,
      page,
      limit: 20,
    }),
    [activeTab, page],
  );

  const { data, kpis, loading, markAsPaid, refetch } = useInvoices(filterParams);

  const handleMarkPaid = async (id: string) => {
    try {
      await markAsPaid(id);
      toast.success('Invoice marked as paid');
      refetch();
    } catch {
      toast.error('Failed to mark invoice as paid');
    }
  };

  const handleDownload = (invoiceNumber: string) => {
    toast.success(`Downloading ${invoiceNumber}...`);
  };

  const handleTabChange = (tab: StatusTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const invoices = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Invoices</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Manage supplier invoices and tip pass-throughs
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Invoiced"
          value={kpis ? formatCurrencyWhole(kpis.totalInvoiced) : '---'}
          change={12.5}
          icon={FileText}
          isLoading={!kpis && loading}
        />
        <KpiCard
          label="Pending"
          value={kpis ? formatCurrencyWhole(kpis.pending) : '---'}
          change={-3.2}
          icon={Clock}
          isLoading={!kpis && loading}
        />
        <KpiCard
          label="Paid"
          value={kpis ? formatCurrencyWhole(kpis.paid) : '---'}
          change={8.7}
          icon={CheckCircle2}
          isLoading={!kpis && loading}
        />
        <KpiCard
          label="Tip Pass-Through"
          value={kpis ? formatCurrencyWhole(kpis.tipPassThrough) : '---'}
          change={5.1}
          icon={Coins}
          isLoading={!kpis && loading}
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2">
        {STATUS_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#FACC15] text-black'
                  : 'bg-[#141414] text-[#9CA3AF] border border-[#2A2A2A] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Supplier
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Period
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Ride Earnings
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Tip Pass-Through
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Commission
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Total
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#2A2A2A] last:border-b-0">
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-28 bg-[#1A1A1A]" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-36 bg-[#1A1A1A]" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-32 bg-[#1A1A1A]" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-20 bg-[#1A1A1A] ml-auto" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-16 bg-[#1A1A1A] ml-auto" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-16 bg-[#1A1A1A] ml-auto" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-20 bg-[#1A1A1A] ml-auto" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-16 bg-[#1A1A1A] mx-auto rounded-full" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-8 w-20 bg-[#1A1A1A] ml-auto" />
                    </td>
                  </tr>
                ))
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-[#6B7280]">
                    No invoices found
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => {
                  const statusDisplay = getInvoiceStatusDisplay(invoice.status);
                  return (
                    <tr
                      key={invoice.id}
                      className="border-b border-[#2A2A2A] last:border-b-0 hover:bg-[#1A1A1A] transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-white">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-4 py-3 text-[#9CA3AF]">
                        {invoice.supplierName}
                      </td>
                      <td className="px-4 py-3 text-[#9CA3AF]">
                        {formatPeriod(invoice.periodStart, invoice.periodEnd)}
                      </td>
                      <td className="px-4 py-3 text-right text-[#9CA3AF] tabular-nums">
                        {formatCurrency(invoice.rideEarnings)}
                      </td>
                      <td className="px-4 py-3 text-right text-[#9CA3AF] tabular-nums">
                        {formatCurrency(invoice.tipPassThrough)}
                      </td>
                      <td className="px-4 py-3 text-right text-[#9CA3AF] tabular-nums">
                        {formatCurrency(invoice.platformCommission)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-white tabular-nums">
                        {formatCurrency(invoice.totalAmount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusDisplay.className}`}
                        >
                          {statusDisplay.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {invoice.status === 'ISSUED' && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkPaid(invoice.id)}
                              className="bg-[#FACC15] text-black hover:bg-[#E5B800] h-8 text-xs"
                            >
                              Mark Paid
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(invoice.invoiceNumber)}
                            className="border-[#2A2A2A] bg-[#141414] text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] h-8"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#2A2A2A] px-4 py-3">
            <p className="text-sm text-[#6B7280]">
              Showing {(meta.page - 1) * meta.limit + 1} to{' '}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} invoices
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={meta.page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="border-[#2A2A2A] bg-[#141414] text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] h-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-[#9CA3AF]">
                Page {meta.page} of {meta.totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={meta.page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="border-[#2A2A2A] bg-[#141414] text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] h-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
