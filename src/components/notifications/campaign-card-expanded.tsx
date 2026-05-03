'use client';

import { Eye, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CampaignStatsCards } from './campaign-stats-cards';
import type { NotificationCampaign } from '@/services/admin/notification.types';
import { toast } from 'sonner';

interface CampaignCardExpandedProps {
  campaign: NotificationCampaign;
  onDuplicate: (id: string) => Promise<NotificationCampaign>;
  onDelete: (id: string) => Promise<void>;
}

export function CampaignCardExpanded({
  campaign,
  onDuplicate,
  onDelete,
}: CampaignCardExpandedProps) {
  const handlePreview = () => {
    toast.info(`Preview: ${campaign.title}\n\n${campaign.body}`);
  };

  const handleDuplicate = async () => {
    try {
      await onDuplicate(campaign.id);
      toast.success('Campaign duplicated as draft');
    } catch {
      toast.error('Failed to duplicate');
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(campaign.id);
      toast.success('Campaign deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="border-t border-[#2A2A2A] bg-[#0A0A0A]/50 px-4 py-4 space-y-4">
      {/* Stats */}
      <CampaignStatsCards campaign={campaign} />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePreview}
          className="h-8 text-xs text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] border border-[#2A2A2A]"
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          Preview
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDuplicate}
          className="h-8 text-xs text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] border border-[#2A2A2A]"
        >
          <Copy className="mr-1.5 h-3.5 w-3.5" />
          Duplicate
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-8 text-xs text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10 border border-[#2A2A2A]"
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}
