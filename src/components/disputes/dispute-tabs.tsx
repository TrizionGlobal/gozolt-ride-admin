'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DISPUTE_TABS, type DisputeTab, type DisputeTabCounts } from '@/services/admin/dispute.types';

interface DisputeTabsProps {
  activeTab: DisputeTab;
  onTabChange: (tab: DisputeTab) => void;
  search: string;
  onSearchChange: (value: string) => void;
  counts: DisputeTabCounts | null;
}

export function DisputeTabs({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  counts,
}: DisputeTabsProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Tab pills */}
      <div className="flex items-center gap-2">
        {DISPUTE_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = tab.countKey && counts ? counts[tab.countKey] : null;

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
              {count !== null && count > 0 && (
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full px-1 text-[10px] font-bold ${
                    isActive
                      ? 'bg-black/20 text-black'
                      : 'bg-[#FACC15] text-black'
                  }`}
                >
                  {count}
                </span>
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
          placeholder="Search reservation..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 w-56 bg-[#141414] border-[#2A2A2A] text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:ring-[#FACC15]/20"
        />
      </div>
    </div>
  );
}
