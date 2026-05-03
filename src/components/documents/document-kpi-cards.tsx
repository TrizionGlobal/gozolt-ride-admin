'use client';

import { Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { DocumentKpis } from '@/services/admin/document.types';

interface DocumentKpiCardsProps {
  kpis: DocumentKpis;
}

const kpiConfig = [
  { key: 'pendingReview' as const, label: 'Pending Review', icon: Clock, color: 'text-yellow-400' },
  { key: 'approved' as const, label: 'Approved', icon: CheckCircle2, color: 'text-green-400' },
  { key: 'rejected' as const, label: 'Rejected', icon: XCircle, color: 'text-red-400' },
  { key: 'expiringSoon' as const, label: 'Expiring Soon', icon: AlertTriangle, color: 'text-orange-400' },
];

export function DocumentKpiCards({ kpis }: DocumentKpiCardsProps) {
  const isLoading = kpis.pendingReview === 0 && kpis.approved === 0 && kpis.rejected === 0 && kpis.expiringSoon === 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[#2A2A2A] bg-[#141414] px-4 py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-md bg-[#2A2A2A]" />
              <div className="space-y-1">
                <Skeleton className="h-6 w-10 bg-[#2A2A2A]" />
                <Skeleton className="h-3 w-20 bg-[#2A2A2A]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {kpiConfig.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className={`rounded-lg border bg-[#141414] px-4 py-3 ${
            key === 'pendingReview' && kpis.pendingReview > 0
              ? 'border-[#FACC15]/40'
              : 'border-[#2A2A2A]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#1A1A1A]">
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{kpis[key]}</p>
              <p className="text-xs text-[#6B7280]">{label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
