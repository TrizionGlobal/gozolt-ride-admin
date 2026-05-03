'use client';

import { ShieldAlert, Trash2, Download, Lock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { GdprKpis } from '@/services/admin/gdpr.types';

interface GdprKpiCardsProps {
  kpis: GdprKpis | null;
  loading: boolean;
}

const KPI_CONFIG = [
  {
    key: 'openBreaches' as const,
    label: 'Open Breaches',
    icon: ShieldAlert,
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/10',
  },
  {
    key: 'pendingDeletions' as const,
    label: 'Pending Deletions',
    icon: Trash2,
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-500/10',
  },
  {
    key: 'dataExportsThisMonth' as const,
    label: 'Data Exports This Month',
    icon: Download,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
  },
  {
    key: 'restrictedAccounts' as const,
    label: 'Restricted Accounts',
    icon: Lock,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10',
  },
];

export function GdprKpiCards({ kpis, loading }: GdprKpiCardsProps) {
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
      {KPI_CONFIG.map(({ key, label, icon: Icon, iconColor, iconBg }) => (
        <div
          key={key}
          className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4"
        >
          <div className="mb-3">
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${iconBg}`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">
            {kpis[key].toLocaleString()}
          </p>
          <p className="text-xs text-[#6B7280] mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
