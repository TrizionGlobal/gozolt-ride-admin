'use client';

import { useState, useMemo } from 'react';
import { AnalyticsDateRangeSelector } from '@/components/analytics/analytics-date-range-selector';
import { AnalyticsKpiCards } from '@/components/analytics/analytics-kpi-cards';
import { AnalyticsDailyRidesChart } from '@/components/analytics/analytics-daily-rides-chart';
import { AnalyticsDailyRevenueChart } from '@/components/analytics/analytics-daily-revenue-chart';
import { AnalyticsUserGrowthChart } from '@/components/analytics/analytics-user-growth-chart';
import { AnalyticsCategoryChart } from '@/components/analytics/analytics-category-chart';
import { CancellationAnalytics } from '@/components/analytics/cancellation-analytics';
import { useAnalytics } from '@/hooks/use-analytics';
import type { DateRange } from '@/services/admin/analytics.types';

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    return { from: today.toISOString(), to: endOfDay.toISOString() };
  });

  const { data, loading } = useAnalytics(range);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Business performance and ride insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AnalyticsDateRangeSelector range={range} onRangeChange={setRange} />
        </div>
      </div>

      {/* KPI Cards */}
      <AnalyticsKpiCards kpis={data?.kpis ?? null} loading={loading} />

      {/* Charts row 1: Daily Rides + Daily Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnalyticsDailyRidesChart data={data?.chartData ?? null} loading={loading} />
        <AnalyticsDailyRevenueChart data={data?.chartData ?? null} loading={loading} />
      </div>

      {/* Charts row 2: User Growth + Category Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnalyticsUserGrowthChart data={data?.chartData ?? null} loading={loading} />
        <AnalyticsCategoryChart data={data?.chartData ?? null} loading={loading} />
      </div>

      {/* Row 3: Cancellation Analytics */}
      <div className="grid grid-cols-1 gap-4">
        <CancellationAnalytics data={data?.cancellations} loading={loading} />
      </div>
    </div>
  );
}
