'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { CampaignCard } from './campaign-card';
import type { NotificationCampaign } from '@/services/admin/notification.types';

interface CampaignCardListProps {
  campaigns: NotificationCampaign[];
  loading: boolean;
  onDuplicate: (id: string) => Promise<NotificationCampaign>;
  onDelete: (id: string) => Promise<void>;
}

export function CampaignCardList({
  campaigns,
  loading,
  onDuplicate,
  onDelete,
}: CampaignCardListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg bg-[#1A1A1A]" />
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-[#6B7280] text-sm">
        No notifications found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
