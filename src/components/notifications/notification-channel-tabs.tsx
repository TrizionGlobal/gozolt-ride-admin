'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CHANNEL_TABS, type ChannelTab } from '@/services/admin/notification.types';

interface NotificationChannelTabsProps {
  activeTab: ChannelTab;
  onTabChange: (tab: ChannelTab) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export function NotificationChannelTabs({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
}: NotificationChannelTabsProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Tab pills */}
      <div className="flex items-center gap-2">
        {CHANNEL_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#FACC15] text-black'
                  : 'bg-[#141414] text-[#9CA3AF] border border-[#2A2A2A] hover:text-white'
              }`}
            >
              {tab.label}
              {tab.hasIndicator && !isActive && (
                <span className="h-2 w-2 rounded-full bg-[#FACC15]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
        <Input
          type="text"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 w-56 bg-[#141414] border-[#2A2A2A] text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:ring-[#FACC15]/20"
        />
      </div>
    </div>
  );
}
