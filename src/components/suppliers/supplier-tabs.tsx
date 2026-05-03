'use client';

import { cn } from '@/lib/utils';

export type SupplierTab = 'all' | 'pending' | 'approved' | 'suspended';

interface SupplierTabsProps {
  activeTab: SupplierTab;
  onTabChange: (tab: SupplierTab) => void;
  pendingCount: number;
}

const tabs: { key: SupplierTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending Approval' },
  { key: 'approved', label: 'Approved' },
  { key: 'suspended', label: 'Suspended' },
];

export function SupplierTabs({ activeTab, onTabChange, pendingCount }: SupplierTabsProps) {
  return (
    <div className="flex items-center gap-1 border-b border-[#2A2A2A]">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={cn(
            'relative px-4 py-2.5 text-sm font-medium transition-colors',
            activeTab === tab.key
              ? 'text-[#FACC15]'
              : 'text-[#6B7280] hover:text-[#9CA3AF]',
          )}
        >
          <span className="flex items-center gap-2">
            {tab.label}
            {tab.key === 'pending' && pendingCount > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FACC15] px-1.5 text-[10px] font-bold text-black">
                {pendingCount}
              </span>
            )}
          </span>
          {/* Active underline */}
          {activeTab === tab.key && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FACC15]" />
          )}
        </button>
      ))}
    </div>
  );
}
