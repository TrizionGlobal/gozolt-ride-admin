'use client';

import { Skeleton } from '@/components/ui/skeleton';
import type { CookieConsentStats as CookieConsentStatsType } from '@/services/admin/gdpr.types';

interface CookieConsentStatsProps {
  stats: CookieConsentStatsType | null;
  loading: boolean;
}

interface StatBarConfig {
  label: string;
  value: number;
  total: number;
  color: string;
  bgColor: string;
}

export function CookieConsentStats({ stats, loading }: CookieConsentStatsProps) {
  if (loading || !stats) {
    return (
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-6">
        <Skeleton className="h-6 w-48 bg-[#1A1A1A] mb-6" />
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 bg-[#1A1A1A] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const bars: StatBarConfig[] = [
    {
      label: 'Total Sessions',
      value: stats.totalSessions,
      total: stats.totalSessions,
      color: 'bg-[#FACC15]',
      bgColor: 'bg-[#FACC15]/10',
    },
    {
      label: 'Analytics Consent',
      value: stats.analyticsConsent,
      total: stats.totalSessions,
      color: 'bg-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Marketing Consent',
      value: stats.marketingConsent,
      total: stats.totalSessions,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Essential Only',
      value: stats.essentialOnly,
      total: stats.totalSessions,
      color: 'bg-gray-500',
      bgColor: 'bg-gray-500/10',
    },
  ];

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Cookie Consent Overview</h3>

      <div className="space-y-5">
        {bars.map(({ label, value, total, color, bgColor }) => {
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
          return (
            <div key={label}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#9CA3AF]">{label}</p>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-white">
                    {value.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#6B7280]">{percentage}%</span>
                </div>
              </div>
              <div className={`h-3 w-full rounded-full ${bgColor}`}>
                <div
                  className={`h-3 rounded-full ${color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
