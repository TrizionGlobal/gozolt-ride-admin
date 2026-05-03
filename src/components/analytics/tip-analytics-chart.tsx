'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { analyticsService } from '@/services/admin/analytics.service';
import type { TipAnalytics, AnalyticsPeriod } from '@/services/admin/analytics.types';

interface TipAnalyticsChartProps {
  period: AnalyticsPeriod;
}

export function TipAnalyticsChart({ period }: TipAnalyticsChartProps) {
  const [data, setData] = useState<TipAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    analyticsService.getTipAnalytics(period).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [period]);

  if (loading) {
    return (
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
        <Skeleton className="h-5 w-40 bg-[#2A2A2A] mb-4" />
        <Skeleton className="h-40 w-full bg-[#2A2A2A] rounded" />
      </div>
    );
  }

  if (!data) return null;

  const maxAmount = Math.max(...data.tipTrend.map((t) => t.amount), 1);

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-4 w-4 text-green-400" />
        <h3 className="text-sm font-medium text-white">Tip Analytics</h3>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="rounded-lg bg-[#0A0A0A] border border-[#2A2A2A] p-3">
          <p className="text-xs text-[#6B7280]">Total Tips</p>
          <p className="text-lg font-bold text-white">{data.totalTips.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-[#0A0A0A] border border-[#2A2A2A] p-3">
          <p className="text-xs text-[#6B7280]">Total Amount</p>
          <p className="text-lg font-bold text-green-400">€{data.totalTipAmount.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-[#0A0A0A] border border-[#2A2A2A] p-3">
          <p className="text-xs text-[#6B7280]">Avg / Ride</p>
          <p className="text-lg font-bold text-white">€{data.avgTipPerRide.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-[#0A0A0A] border border-[#2A2A2A] p-3">
          <p className="text-xs text-[#6B7280]">Tip Rate</p>
          <p className="text-lg font-bold text-white">{data.tipRate}%</p>
        </div>
      </div>

      {/* Simple bar chart */}
      <div className="h-32 flex items-end gap-px">
        {data.tipTrend.slice(-30).map((point, i) => (
          <div
            key={i}
            className="flex-1 bg-green-500/40 hover:bg-green-500/60 transition-colors rounded-t-sm min-w-[2px]"
            style={{ height: `${(point.amount / maxAmount) * 100}%` }}
            title={`${point.period}: €${point.amount} (${point.count} tips)`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-[#6B7280]">{data.tipTrend[0]?.period}</span>
        <span className="text-[10px] text-[#6B7280]">{data.tipTrend[data.tipTrend.length - 1]?.period}</span>
      </div>
    </div>
  );
}
