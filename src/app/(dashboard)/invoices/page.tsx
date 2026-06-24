'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { InvoicePrintTemplate } from '@/components/invoices/invoice-print-template';
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
import { ServerSideTable, type ColumnDef } from '@/components/ui/server-side-table';
import { getInvoiceStatusDisplay } from '@/services/admin/invoice.types';
import type { InvoiceStatus, InvoiceFilterParams, InvoiceListItem } from '@/services/admin/invoice.types';
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

  const [invoiceToPrint, setInvoiceToPrint] = useState<InvoiceListItem | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrintFn = useReactToPrint({
    contentRef: printRef,
    onAfterPrint: () => setInvoiceToPrint(null),
  });

  useEffect(() => {
    if (invoiceToPrint) {
      const timer = setTimeout(() => {
        handlePrintFn();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [invoiceToPrint, handlePrintFn]);

  const handleDownload = (invoice: InvoiceListItem) => {
    toast.success(`Preparing to print ${invoice.invoiceNumber}...`);
    setInvoiceToPrint(invoice);
  };

  const handleTabChange = (tab: StatusTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const invoices = data?.data ?? [];
  const meta = data?.meta;

  const columns: ColumnDef<InvoiceListItem>[] = [
    {
      key: 'invoiceNumber',
      title: 'Invoice #',
      render: (r) => <span className="font-medium text-white">{r.invoiceNumber}</span>,
    },
    {
      key: 'supplierName',
      title: 'Supplier',
      render: (r) => <span className="text-[#9CA3AF]">{r.supplierName}</span>,
    },
    {
      key: 'period',
      title: 'Period',
      render: (r) => <span className="text-[#9CA3AF]">{formatPeriod(r.periodStart, r.periodEnd)}</span>,
    },
    {
      key: 'rideEarnings',
      title: <div className="text-right">Ride Earnings</div>,
      render: (r) => <div className="text-right text-[#9CA3AF] tabular-nums">{formatCurrency(r.rideEarnings)}</div>,
    },
    {
      key: 'tipPassThrough',
      title: <div className="text-right">Tip Pass-Through</div>,
      render: (r) => <div className="text-right text-[#9CA3AF] tabular-nums">{formatCurrency(r.tipPassThrough)}</div>,
    },
    {
      key: 'platformCommission',
      title: <div className="text-right">Commission</div>,
      render: (r) => <div className="text-right text-[#9CA3AF] tabular-nums">{formatCurrency(r.platformCommission)}</div>,
    },
    {
      key: 'totalAmount',
      title: <div className="text-right">Total</div>,
      render: (r) => <div className="text-right font-medium text-white tabular-nums">{formatCurrency(r.totalAmount)}</div>,
    },
    {
      key: 'status',
      title: <div className="text-center">Status</div>,
      render: (r) => {
        const statusDisplay = getInvoiceStatusDisplay(r.status);
        return (
          <div className="text-center">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusDisplay?.className}`}>
              {statusDisplay?.label}
            </span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      title: <div className="text-right">Actions</div>,
      render: (r) => (
        <div className="flex items-center justify-end gap-2">
          {r.status === 'ISSUED' && (
            <Button
              size="sm"
              onClick={() => handleMarkPaid(r.id)}
              className="bg-[#FACC15] text-black hover:bg-[#E5B800] h-8 text-xs"
            >
              Mark Paid
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDownload(r)}
            className="border-[#2A2A2A] bg-[#141414] text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] h-8"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

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
          icon={FileText}
          isLoading={!kpis && loading}
        />
        <KpiCard
          label="Pending"
          value={kpis ? formatCurrencyWhole(kpis.pending) : '---'}
          icon={Clock}
          isLoading={!kpis && loading}
        />
        <KpiCard
          label="Paid"
          value={kpis ? formatCurrencyWhole(kpis.paid) : '---'}
          icon={CheckCircle2}
          isLoading={!kpis && loading}
        />
        <KpiCard
          label="Tip Pass-Through"
          value={kpis ? formatCurrencyWhole(kpis.tipPassThrough) : '---'}
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
      <ServerSideTable
        columns={columns}
        data={invoices}
        isLoading={loading}
        page={page}
        limit={20}
        total={meta?.total || 0}
        onPageChange={setPage}
        onLimitChange={() => {}}
        emptyText="No invoices found"
      />

      {/* Hidden Print Template */}
      <div className="hidden">
        <InvoicePrintTemplate ref={printRef} invoice={invoiceToPrint} />
      </div>
    </div>
  );
}
