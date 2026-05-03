'use client';

import { cn } from '@/lib/utils';
import { CAMPAIGN_STATUS_STYLES, type CampaignStatus } from '@/services/admin/notification.types';

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
}

export function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  const style = CAMPAIGN_STATUS_STYLES[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        style.color,
      )}
    >
      {style.label}
    </span>
  );
}
