'use client';

import { cn } from '@/lib/utils';
import { getChannelBadge, type NotificationChannel } from '@/services/admin/notification.types';

interface CampaignChannelBadgeProps {
  channels: NotificationChannel[];
}

export function CampaignChannelBadge({ channels }: CampaignChannelBadgeProps) {
  const badge = getChannelBadge(channels);
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium',
        badge.color,
      )}
    >
      {badge.label}
    </span>
  );
}
