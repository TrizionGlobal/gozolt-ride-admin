'use client';

import { Clock, FileCheck, RotateCcw, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { PenaltyKPIs } from '@/services/admin/penalty.types';

interface PenaltyKpiCardsProps {
  kpis: PenaltyKPIs | null;
  loading: boolean;
}

const KPI_CONFIG = [
  { key: 'pending' as const, label: 'Pending', icon: Clock, iconColor: 'text-yellow-400' },
  { key: 'applied' as const, label: 'Applied', icon: FileCheck, iconColor: 'text-green-400' },
  { key: 'voided' as const, label: 'Voided', icon: RotateCcw, iconColor: 'text-blue-400' },
  { key: 'paid' as const, label: 'Paid', icon: CheckCircle, iconColor: 'text-green-400' },
];

export function PenaltyKpiCards({ kpis, loading }: PenaltyKpiCardsProps) {
  if (loading || !kpis) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg bg-[#1A1A1A]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {KPI_CONFIG.map(({ key, label, icon: Icon, iconColor }) => (
        <div
          key={key}
          className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-[#9CA3AF] mb-1">{label}</p>
            <p className="text-2xl font-bold text-white">{kpis[key]}</p>
          </div>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      ))}
    </div>
  );
}
