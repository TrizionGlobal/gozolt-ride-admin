'use client';

import { DollarSign, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/kpi-card';
import type { PaymentKpis } from '@/services/admin/payment.types';

interface PaymentKpiCardsProps {
  kpis: PaymentKpis | null;
  loading: boolean;
}

function fmt(n: number | undefined | null): string {
  const num = Number(n);
  if (isNaN(num)) return '0';
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return num.toLocaleString();
}

export function PaymentKpiCards({ kpis, loading }: PaymentKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Today's Revenue"
        value={kpis ? fmt(kpis.todayRevenue) : '—'}
        icon={DollarSign}
        prefix="€"
        isLoading={loading}
      />

      {/* Card 2 — Pending Payouts Suppliers */}
      {loading ? (
        <KpiCard
          label="Pending Payouts Supplier"
          value="—"
          icon={Clock}
          prefix="€"
          isLoading
        />
      ) : (
        <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FACC15]" />
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1A1A1A]">
              <Clock className="h-4 w-4 text-[#FACC15]" />
            </div>
            {kpis && kpis.pendingSuppliersCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 text-yellow-400 px-2 py-0.5 text-xs font-medium">
                {kpis.pendingSuppliersCount} supplier{kpis.pendingSuppliersCount === 1 ? '' : 's'}
              </span>
            )}
          </div>
          <p className="text-xl font-bold text-white mt-1">
            €{kpis ? fmt(kpis.pendingPayoutsAmount) : '—'}
          </p>
          <p className="text-xs text-[#6B7280] mt-0.5">Pending Payouts</p>
        </div>
      )}

      {/* Card 3 — Completed Payout Suppliers */}
      {loading ? (
        <KpiCard
          label="Completed Payout Suppliers"
          value="—"
          icon={CheckCircle}
          prefix="€"
          isLoading
        />
      ) : (
        <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-green-500" />
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1A1A1A]">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            {kpis && kpis.completedSuppliersCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 text-green-400 px-2 py-0.5 text-xs font-medium">
                {kpis.completedSuppliersCount} supplier{kpis.completedSuppliersCount === 1 ? '' : 's'}
              </span>
            )}
          </div>
          <p className="text-xl font-bold text-white mt-1">
            €{kpis ? fmt(kpis.completedPayoutsAmount) : '—'}
          </p>
          <p className="text-xs text-[#6B7280] mt-0.5">Completed Payouts</p>
        </div>
      )}

      {/* Card 4 — Forget to pay overdue */}
      {loading ? (
        <KpiCard
          label="Forget to pay overdue"
          value="—"
          icon={AlertTriangle}
          prefix="€"
          isLoading
        />
      ) : (
        <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-500" />
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1A1A1A]">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            {kpis && kpis.overdueSuppliersCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 text-red-400 px-2 py-0.5 text-xs font-medium">
                {kpis.overdueSuppliersCount} supplier{kpis.overdueSuppliersCount === 1 ? '' : 's'}
              </span>
            )}
          </div>
          <p className="text-xl font-bold text-white mt-1">
            €{kpis ? fmt(kpis.overduePayoutsAmount) : '—'}
          </p>
          <p className="text-xs text-[#6B7280] mt-0.5">Forget to pay overdue</p>
        </div>
      )}
    </div>
  );
}
