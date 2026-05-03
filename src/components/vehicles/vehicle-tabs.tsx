'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export type VehicleTab = 'all' | 'active' | 'pending' | 'suspended' | 'inactive';

interface VehicleTabsProps {
  activeTab: VehicleTab;
  onTabChange: (tab: VehicleTab) => void;
  pendingCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  onFiltersClick: () => void;
}

const tabs: { key: VehicleTab; label: string }[] = [
  { key: 'all', label: 'All drivers' },
  { key: 'active', label: 'Active' },
  { key: 'pending', label: 'Pending Inspection' },
  { key: 'suspended', label: 'Suspended' },
  { key: 'inactive', label: 'Inactive' },
];

export function VehicleTabs({
  activeTab,
  onTabChange,
  pendingCount,
  search,
  onSearchChange,
  onFiltersClick,
}: VehicleTabsProps) {
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
            <span className="flex items-center gap-1.5">
              {tab.label}
              {tab.key === 'pending' && pendingCount > 0 && (
                <span
                  className={cn(
                    'inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold',
                    activeTab === 'pending'
                      ? 'bg-black/20 text-black'
                      : 'bg-[#FACC15] text-black',
                  )}
                >
                  {pendingCount}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-2">
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
        <button
          onClick={onFiltersClick}
          className="flex items-center gap-2 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 h-9 text-sm text-[#9CA3AF] hover:text-white hover:border-[#3A3A3A] transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>
    </div>
  );
}
