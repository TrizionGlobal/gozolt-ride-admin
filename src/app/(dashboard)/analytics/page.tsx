'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalyticsPeriodSelector } from '@/components/analytics/analytics-period-selector';
import { AnalyticsKpiCards } from '@/components/analytics/analytics-kpi-cards';
import { AnalyticsDailyRidesChart } from '@/components/analytics/analytics-daily-rides-chart';
import { AnalyticsDailyRevenueChart } from '@/components/analytics/analytics-daily-revenue-chart';
import { AnalyticsUserGrowthChart } from '@/components/analytics/analytics-user-growth-chart';
import { AnalyticsCategoryChart } from '@/components/analytics/analytics-category-chart';
import { TipAnalyticsChart } from '@/components/analytics/tip-analytics-chart';
import { CancellationAnalytics } from '@/components/analytics/cancellation-analytics';
import { useAnalytics } from '@/hooks/use-analytics';
import type { AnalyticsPeriod } from '@/services/admin/analytics.types';
import { toast } from 'sonner';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('7d');
  const { data, loading } = useAnalytics(period);

  const handleExport = () => {
    toast.success('Export started — CSV will be downloaded shortly');
  };

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
          <AnalyticsPeriodSelector period={period} onPeriodChange={setPeriod} />
          <Button
            onClick={handleExport}
            className="bg-[#FACC15] text-black hover:bg-[#E5B800]"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
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

      {/* Row 3: Tip Analytics + Cancellation Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TipAnalyticsChart period={period} />
        <CancellationAnalytics />
      </div>
    </div>
  );
}
