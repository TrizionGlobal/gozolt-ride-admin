'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import { CampaignIcon } from './campaign-icon';
import { CampaignChannelBadge } from './campaign-channel-badge';
import { CampaignStatusBadge } from './campaign-status-badge';
import { CampaignCardExpanded } from './campaign-card-expanded';
import {
  getAudienceDisplay,
  type NotificationCampaign,
} from '@/services/admin/notification.types';

interface CampaignCardProps {
  campaign: NotificationCampaign;
  onDelete: (id: string) => Promise<void>;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${mins}`;
}

export function CampaignCard({ campaign, onDelete }: CampaignCardProps) {
  const [expanded, setExpanded] = useState(false);

  const audienceText = getAudienceDisplay(campaign);
  const dateText = formatDate(campaign.sentAt ?? campaign.scheduledAt ?? campaign.createdAt);

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] overflow-hidden transition-colors hover:border-[#3A3A3A]">
      {/* Main card content */}
      <div className="px-4 py-3">
        {/* Line 1: Icon, title, status, chevron */}
        <div className="flex items-center gap-3">
          <CampaignIcon title={campaign.title} />

          <span className="text-sm font-medium text-white truncate">
            {campaign.title}
          </span>

          <div className="flex-1" />

          <CampaignStatusBadge status={campaign.status} />

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[#6B7280] hover:text-white transition-colors shrink-0"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Line 2: Channel badge, audience, date */}
        <div className="flex items-center gap-3 mt-2 ml-12">
          <CampaignChannelBadge channels={campaign.channels} />
          <div className="flex items-center gap-1.5 text-[#6B7280]">
            <Users className="h-3.5 w-3.5" />
            <span className="text-xs">{audienceText}</span>
          </div>
          <span className="text-xs text-[#6B7280]">{dateText}</span>
        </div>
      </div>

      {/* Expanded section */}
      {expanded && (
        <CampaignCardExpanded
          campaign={campaign}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
