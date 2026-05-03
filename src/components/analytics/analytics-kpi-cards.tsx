'use client';

import { LayoutGrid, Euro, TrendingUp, Users } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/kpi-card';
import type { AnalyticsKpis } from '@/services/admin/analytics.types';

interface AnalyticsKpiCardsProps {
  kpis: AnalyticsKpis | null;
  loading: boolean;
}

export function AnalyticsKpiCards({ kpis, loading }: AnalyticsKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Total Rides"
        value={kpis ? kpis.totalRides.toLocaleString() : '—'}
        change={kpis?.changes.totalRides ?? 0}
        icon={LayoutGrid}
        isLoading={loading}
      />
      <KpiCard
        label="Revenue"
        value={kpis ? kpis.revenue.toLocaleString() : '—'}
        change={kpis?.changes.revenue ?? 0}
        icon={Euro}
        prefix="€"
        isLoading={loading}
      />
      <KpiCard
        label="Avg Ride Value"
        value={kpis ? kpis.avgRideValue.toFixed(2) : '—'}
        change={kpis?.changes.avgRideValue ?? 0}
        icon={TrendingUp}
        prefix="€"
        isLoading={loading}
      />
      <KpiCard
        label="Active Users"
        value={kpis ? kpis.activeUsers.toLocaleString() : '—'}
        change={kpis?.changes.activeUsers ?? 0}
        icon={Users}
        isLoading={loading}
      />
    </div>
  );
}
