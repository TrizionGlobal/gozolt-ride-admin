'use client';

import { LayoutGrid, CircleDot, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { DisputeKPIs } from '@/services/admin/dispute.types';

interface DisputeKpiCardsProps {
  kpis: DisputeKPIs | null;
  loading: boolean;
}

const KPI_CONFIG = [
  {
    key: 'total' as const,
    label: 'Total Disputes',
    icon: LayoutGrid,
    iconColor: 'text-[#9CA3AF]',
    changeKey: 'total' as const,
  },
  {
    key: 'open' as const,
    label: 'Open',
    icon: CircleDot,
    iconColor: 'text-[#22C55E]',
    changeKey: 'open' as const,
  },
  {
    key: 'inReview' as const,
    label: 'In Review',
    icon: Clock,
    iconColor: 'text-[#FACC15]',
    changeKey: 'inReview' as const,
  },
  {
    key: 'escalated' as const,
    label: 'Escalated',
    icon: AlertTriangle,
    iconColor: 'text-[#EF4444]',
    changeKey: 'escalated' as const,
  },
];

export function DisputeKpiCards({ kpis, loading }: DisputeKpiCardsProps) {
  if (loading || !kpis) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg bg-[#1A1A1A]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {KPI_CONFIG.map(({ key, label, icon: Icon, iconColor, changeKey }) => {
        const change = kpis.changes[changeKey];
        return (
          <div
            key={key}
            className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <Icon className={`h-5 w-5 ${iconColor}`} />
              {change !== null && (
                <div className="flex items-center gap-1 text-[#22C55E]">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">+{change}%</span>
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-white">
              {kpis[key].toLocaleString()}
            </p>
            <p className="text-xs text-[#6B7280] mt-1">{label}</p>
          </div>
        );
      })}
    </div>
  );
}
