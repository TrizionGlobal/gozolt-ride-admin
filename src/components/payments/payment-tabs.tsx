'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PaymentTab = 'ride' | 'payout' | 'refund' | 'tip' | 'settlement';

interface PaymentTabsProps {
  activeTab: PaymentTab;
  onTabChange: (tab: PaymentTab) => void;
  search: string;
  onSearchChange: (value: string) => void;
  status?: string;
  onStatusChange?: (status: string) => void;
  onExport?: () => void;
}

const tabs: { key: PaymentTab; label: string }[] = [
  { key: 'settlement', label: 'Process Settlements' },
  { key: 'payout', label: 'Supplier Payouts' },
];

export function PaymentTabs({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  status,
  onStatusChange,
  onExport,
}: PaymentTabsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Pill tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-[#141414] border border-[#2A2A2A] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap',
              activeTab === tab.key
                ? 'bg-[#FACC15] text-black'
                : 'text-[#6B7280] hover:text-[#9CA3AF]',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search, Filters & Export */}
      <div className="flex items-center gap-3">
        {/* 1. Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search transactions..."
            className="h-9 w-64 rounded-md border border-[#2A2A2A] bg-[#141414] pl-9 pr-3 text-sm text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20"
          />
        </div>

        {/* 2. Filter */}
        {activeTab === 'settlement' && onStatusChange && (
          <select
            value={status || 'ALL'}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-9 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-[#9CA3AF] focus:border-[#FACC15] focus:outline-none"
          >
            <option value="ALL">All Settlements</option>
            <option value="OVERDUE">Forgot to Pay (Overdue)</option>
            <option value="DUE_TODAY">Today's Payments</option>
            <option value="PENDING">Pending (Not Due)</option>
            <option value="COMPLETED">Payment Completed</option>
          </select>
        )}

        {activeTab === 'payout' && onStatusChange && (
          <select
            value={status || 'ALL'}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-9 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-[#9CA3AF] focus:border-[#FACC15] focus:outline-none"
          >
            <option value="ALL">All Payouts</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>
        )}

        {/* 3. Export */}
        {onExport && (
          <button
            onClick={onExport}
            className="h-9 px-3 rounded-md border border-[#2A2A2A] bg-[#0A0A0A] text-sm text-[#9CA3AF] hover:bg-[#1A1A1A] hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download h-4 w-4">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
            </svg>
            Export
          </button>
        )}
      </div>
    </div>
  );
}
