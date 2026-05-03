'use client';

import { cn } from '@/lib/utils';
import type { AnalyticsPeriod } from '@/services/admin/analytics.types';

interface AnalyticsPeriodSelectorProps {
  period: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
}

const periods: { key: AnalyticsPeriod; label: string }[] = [
  { key: '7d', label: '7d' },
  { key: '30d', label: '30d' },
  { key: '90d', label: '90d' },
  { key: '1Y', label: '1Y' },
];

export function AnalyticsPeriodSelector({
  period,
  onPeriodChange,
}: AnalyticsPeriodSelectorProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-[#141414] border border-[#2A2A2A] p-1">
      {periods.map((p) => (
        <button
          key={p.key}
          onClick={() => onPeriodChange(p.key)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            period === p.key
              ? 'bg-[#FACC15] text-black'
              : 'text-[#6B7280] hover:text-[#9CA3AF]',
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
