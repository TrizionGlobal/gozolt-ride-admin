'use client';

import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { Button } from '@/components/ui/button';
import { NotificationKpiCards } from '@/components/notifications/notification-kpi-cards';
import { NotificationChannelTabs } from '@/components/notifications/notification-channel-tabs';
import { CampaignCardList } from '@/components/notifications/campaign-card-list';
import { ComposeNotificationModal } from '@/components/notifications/compose-notification-modal';
import { useCampaigns, useNotificationStats } from '@/hooks/use-notifications';
import type { ChannelTab } from '@/services/admin/notification.types';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<ChannelTab>('all');
  const [search, setSearch] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);

  const { campaigns, loading, createCampaign, deleteCampaign, duplicateCampaign } = useCampaigns(
    activeTab,
    search,
  );
  const { stats, loading: statsLoading } = useNotificationStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Send and manage push, email, SMS, and in-app notifications
          </p>
        </div>
        <Button
          onClick={() => setComposeOpen(true)}
          className="bg-[#FACC15] text-black hover:bg-[#E5B800] font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Compose
        </Button>
      </div>

      {/* KPI Cards */}
      <NotificationKpiCards stats={stats} loading={statsLoading} />

      {/* Channel Tabs + Search */}
      <NotificationChannelTabs
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSearch('');
        }}
        search={search}
        onSearchChange={(v: string) => setSearch(sanitizeSearchQuery(v))}
      />

      {/* Campaign Cards */}
      <CampaignCardList
        campaigns={campaigns}
        loading={loading}
        onDuplicate={duplicateCampaign}
        onDelete={deleteCampaign}
      />

      {/* Compose Modal */}
      <ComposeNotificationModal
        open={composeOpen}
        onOpenChange={setComposeOpen}
        onCreate={createCampaign}
      />
    </div>
  );
}
