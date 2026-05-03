'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RideTab = 'active' | 'all' | 'cancelled' | 'disputed';

interface RideTabsProps {
  activeTab: RideTab;
  onTabChange: (tab: RideTab) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const tabs: { key: RideTab; label: string }[] = [
  { key: 'active', label: 'Active (Live)' },
  { key: 'all', label: 'All Rides' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'disputed', label: 'Disputed' },
];

export function RideTabs({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
}: RideTabsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Pill tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-[#141414] border border-[#2A2A2A] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap',
              activeTab === tab.key
                ? 'bg-[#FACC15] text-black'
                : 'text-[#6B7280] hover:text-[#9CA3AF]',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search reservation..."
          className="h-9 w-64 rounded-md border border-[#2A2A2A] bg-[#141414] pl-9 pr-3 text-sm text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20"
        />
      </div>
    </div>
  );
}
