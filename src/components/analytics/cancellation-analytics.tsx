'use client';

import { XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { CancellationAnalytics as CancellationData } from '@/services/admin/analytics.types';

const ACTOR_COLORS: Record<string, string> = {
  USER: 'bg-yellow-400',
  DRIVER: 'bg-blue-400',
  SYSTEM: 'bg-gray-400',
};

const ACTOR_LABELS: Record<string, string> = {
  USER: 'User',
  DRIVER: 'Driver',
  SYSTEM: 'System',
};

interface CancellationAnalyticsProps {
  data?: CancellationData | null;
  loading?: boolean;
}

export function CancellationAnalytics({ data, loading }: CancellationAnalyticsProps) {

  if (loading) {
    return (
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
        <Skeleton className="h-5 w-48 bg-[#2A2A2A] mb-4" />
        <Skeleton className="h-48 w-full bg-[#2A2A2A] rounded" />
      </div>
    );
  }

  if (!data) return null;

  const totalActors = data.byActor.reduce((s, a) => s + a.count, 0);

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <XCircle className="h-4 w-4 text-red-400" />
        <h3 className="text-sm font-medium text-white">Cancellation Analytics</h3>
      </div>

      {/* Top stat */}
      <div className="flex items-center gap-6 mb-4">
        <div>
          <p className="text-xs text-[#6B7280]">Total Cancellations</p>
          <p className="text-2xl font-bold text-white">{data.totalCancellations}</p>
        </div>
        <div>
          <p className="text-xs text-[#6B7280]">Cancellation Rate</p>
          <p className="text-2xl font-bold text-red-400">{data.cancellationRate}%</p>
        </div>
      </div>

      {/* Reasons horizontal bars */}
      <div className="mb-4">
        <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">By Reason</p>
        <div className="space-y-2">
          {data.byReason.map((r) => (
            <div key={r.reason}>
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className="text-[#9CA3AF]">{r.reason}</span>
                <span className="text-white font-medium">{r.count} ({r.percentage}%)</span>
              </div>
              <div className="h-2 rounded-full bg-[#2A2A2A] overflow-hidden">
                <div
                  className="h-full rounded-full bg-red-400/60"
                  style={{ width: `${r.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actor breakdown */}
      <div>
        <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">By Actor</p>
        <div className="flex items-center gap-3">
          {data.byActor.map((a) => {
            const pct = totalActors > 0 ? ((a.count / totalActors) * 100).toFixed(0) : '0';
            return (
              <div key={a.actor} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${ACTOR_COLORS[a.actor]}`} />
                <span className="text-xs text-[#9CA3AF]">{ACTOR_LABELS[a.actor]}: {a.count} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
