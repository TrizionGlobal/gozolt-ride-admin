'use client';

import { DollarSign, Clock, CalendarDays, RotateCcw, Heart } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/kpi-card';
import type { PaymentKpis } from '@/services/admin/payment.types';

interface PaymentKpiCardsProps {
  kpis: PaymentKpis | null;
  loading: boolean;
}

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return n.toLocaleString();
}

export function PaymentKpiCards({ kpis, loading }: PaymentKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <KpiCard
        label="Today's Revenue"
        value={kpis ? fmt(kpis.todayRevenue) : '—'}
        change={12}
        icon={DollarSign}
        prefix="€"
        isLoading={loading}
      />

      {/* Card 2 — Pending Payouts with unique "suppliers" mini badge */}
      {loading ? (
        <KpiCard
          label="Pending Payouts"
          value="—"
          change={0}
          icon={Clock}
          prefix="€"
          isLoading
        />
      ) : (
        <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FACC15]" />
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#1A1A1A]">
              <Clock className="h-5 w-5 text-[#FACC15]" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 text-yellow-400 px-2 py-0.5 text-xs font-medium">
              3 suppliers
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            €{kpis ? fmt(kpis.pendingPayouts) : '—'}
          </p>
          <p className="text-xs text-[#6B7280] mt-0.5">Pending Payouts</p>
        </div>
      )}

      <KpiCard
        label="This Month"
        value={kpis ? fmt(kpis.thisMonth) : '—'}
        change={8}
        icon={CalendarDays}
        prefix="€"
        isLoading={loading}
      />

      <KpiCard
        label="Refunds (30d)"
        value={kpis ? fmt(kpis.refunds30d) : '—'}
        change={-3}
        icon={RotateCcw}
        prefix="€"
        isLoading={loading}
      />

      <KpiCard
        label="Tip Revenue (30d)"
        value={kpis ? fmt(kpis.tipRevenue30d) : '—'}
        change={15}
        icon={Heart}
        prefix="€"
        isLoading={loading}
      />
    </div>
  );
}
