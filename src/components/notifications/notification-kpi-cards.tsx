'use client';

import { Send, Smartphone, Mail, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { NotificationStats } from '@/services/admin/notification.types';

interface NotificationKpiCardsProps {
  stats: NotificationStats | null;
  loading: boolean;
}

const KPI_CONFIG = [
  { key: 'sentToday' as const, label: 'Sent Today', icon: Send, iconColor: 'text-[#9CA3AF]', suffix: '' },
  { key: 'pushDeliveryRate' as const, label: 'Push Delivered', icon: Smartphone, iconColor: 'text-[#9CA3AF]', suffix: '%' },
  { key: 'emailOpenRate' as const, label: 'Email Opened', icon: Mail, iconColor: 'text-[#9CA3AF]', suffix: '%' },
  { key: 'scheduledCount' as const, label: 'Scheduled', icon: Clock, iconColor: 'text-[#9CA3AF]', suffix: '' },
];

export function NotificationKpiCards({ stats, loading }: NotificationKpiCardsProps) {
  if (loading || !stats) {
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
      {KPI_CONFIG.map(({ key, label, icon: Icon, iconColor, suffix }) => (
        <div
          key={key}
          className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4"
        >
          <div className="mb-3">
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <p className="text-2xl font-bold text-white">
            {typeof stats[key] === 'number' && key === 'sentToday'
              ? stats[key].toLocaleString()
              : stats[key]}
            {suffix}
          </p>
          <p className="text-xs text-[#6B7280] mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
