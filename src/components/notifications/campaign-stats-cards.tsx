'use client';

import type { NotificationCampaign } from '@/services/admin/notification.types';
import { getChannelBadge } from '@/services/admin/notification.types';

interface CampaignStatsCardsProps {
  campaign: NotificationCampaign;
}

export function CampaignStatsCards({ campaign }: CampaignStatsCardsProps) {
  const deliveryRate =
    campaign.sentCount > 0
      ? ((campaign.deliveredCount / campaign.sentCount) * 100).toFixed(1)
      : '0.0';
  const openRate =
    campaign.deliveredCount > 0
      ? ((campaign.openedCount / campaign.deliveredCount) * 100).toFixed(1)
      : '0.0';

  const channelLabel = getChannelBadge(campaign.channels).label;

  const stats = [
    { label: 'Sent', value: campaign.sentCount.toString(), sub: null },
    { label: 'Channel', value: channelLabel, sub: null },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-3"
        >
          <p className="text-xs text-[#6B7280] mb-1">{stat.label}</p>
          <p className="text-lg font-bold text-white">{stat.value}</p>
          {stat.sub && (
            <p className="text-xs text-[#22C55E] mt-0.5">{stat.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}
