'use client';

import { useMemo } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSuppliers } from '@/hooks/use-suppliers';

export type DriverTab = 'all' | 'online' | 'pending' | 'suspended' | 'inactive';

interface DriverTabsProps {
  activeTab: DriverTab;
  onTabChange: (tab: DriverTab) => void;
  pendingCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  supplierId: string;
  onSupplierIdChange: (value: string) => void;
}

const tabs: { key: DriverTab; label: string }[] = [
  { key: 'all', label: 'All Drivers' },
  { key: 'online', label: 'Online' },
  { key: 'pending', label: 'Pending Approval' },
  { key: 'suspended', label: 'Suspended' },
  { key: 'inactive', label: 'Inactive' },
];

export function DriverTabs({
  activeTab,
  onTabChange,
  pendingCount,
  search,
  onSearchChange,
  supplierId,
  onSupplierIdChange,
}: DriverTabsProps) {
  const supplierParams = useMemo(() => ({ limit: 100 }), []);
  const { data: suppliersData } = useSuppliers(supplierParams);
  
  const supplierOptions = useMemo(() => {
    const options = [{ value: 'all', label: 'All Suppliers' }];
    if (suppliersData?.data) {
      suppliersData.data.forEach(s => {
        options.push({ value: s.id, label: s.companyName });
      });
    }
    return options;
  }, [suppliersData]);

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Pill tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-[#141414] border border-[#2A2A2A] p-1 overflow-x-auto">
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
            placeholder="Search drivers..."
            className="h-9 w-64 rounded-md border border-[#2A2A2A] bg-[#141414] pl-9 pr-3 text-sm text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20"
          />
        </div>
        
        <Select 
          value={supplierId || 'all'} 
          onValueChange={(val) => onSupplierIdChange(val === 'all' ? '' : val)}
        >
          <SelectTrigger className="w-48 h-9 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white focus:ring-1 focus:ring-[#FACC15]/20 focus:border-[#FACC15]">
            <SelectValue placeholder="All Suppliers" />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
            {supplierOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value || 'all'} className="focus:bg-[#2A2A2A] focus:text-white cursor-pointer">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
