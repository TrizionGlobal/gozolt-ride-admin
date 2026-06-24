'use client';

import { Trash2 } from 'lucide-react';
import { getChannelBadge } from '@/services/admin/notification.types';
import type { NotificationCampaign } from '@/services/admin/notification.types';
import { toast } from 'sonner';

interface CampaignCardExpandedProps {
  campaign: NotificationCampaign;
  onDelete: (id: string) => Promise<void>;
}

export function CampaignCardExpanded({
  campaign,
  onDelete,
}: CampaignCardExpandedProps) {

  const handleDelete = async () => {
    try {
      await onDelete(campaign.id);
      toast.success('Campaign deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="border-t border-[#2A2A2A] bg-[#0A0A0A]/30 px-4 py-3 flex flex-col gap-3">
      {/* Message Body */}
      <div className="text-sm text-[#D1D5DB]">
        {campaign.body}
      </div>

      {/* Footer: Stats & Action */}
      <div className="flex items-center justify-between pt-2 border-t border-[#2A2A2A]/50 mt-1">
        <div className="flex items-center gap-6 text-xs text-[#6B7280]">
          <div>
            Sent: <span className="text-white font-medium ml-1">{campaign.sentCount}</span>
          </div>
          <div>
            Channel: <span className="text-white font-medium ml-1">{getChannelBadge(campaign.channels).label}</span>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="text-xs text-[#EF4444] hover:text-red-400 flex items-center transition-colors"
        >
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}
