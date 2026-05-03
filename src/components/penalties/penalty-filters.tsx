'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  PENALTY_TYPE_OPTIONS,
  ENTITY_TYPE_OPTIONS,
  PENALTY_STATUS_OPTIONS,
} from '@/services/admin/penalty.types';
import type { PenaltyType, PenaltyEntityType, PenaltyStatus } from '@/services/admin/penalty.types';
import { toast } from 'sonner';

interface PenaltyFiltersProps {
  type: string;
  onTypeChange: (value: PenaltyType | '') => void;
  entityType: string;
  onEntityTypeChange: (value: PenaltyEntityType | '') => void;
  status: string;
  onStatusChange: (value: PenaltyStatus | '') => void;
  fromDate: string;
  onFromDateChange: (value: string) => void;
  toDate: string;
  onToDateChange: (value: string) => void;
}

const dateClass =
  'h-9 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20';

export function PenaltyFilters({
  type,
  onTypeChange,
  entityType,
  onEntityTypeChange,
  status,
  onStatusChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
}: PenaltyFiltersProps) {
  const handleExport = () => {
    toast.success('Export started — CSV will be downloaded shortly');
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Type filter - yellow pill style */}
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value as PenaltyType | '')}
        className="h-9 rounded-full border border-[#FACC15]/40 bg-[#FACC15]/10 px-4 text-sm text-[#FACC15] font-medium focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20 appearance-none cursor-pointer"
      >
        {PENALTY_TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#141414] text-white">
            {opt.label}
          </option>
        ))}
      </select>

      {/* Entity type filter */}
      <select
        value={entityType}
        onChange={(e) => onEntityTypeChange(e.target.value as PenaltyEntityType | '')}
        className="h-9 rounded-full border border-[#2A2A2A] bg-[#141414] px-4 text-sm text-[#9CA3AF] focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20 appearance-none cursor-pointer"
      >
        {ENTITY_TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#141414]">
            {opt.label}
          </option>
        ))}
      </select>

      {/* Status filter */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as PenaltyStatus | '')}
        className="h-9 rounded-full border border-[#2A2A2A] bg-[#141414] px-4 text-sm text-[#9CA3AF] focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20 appearance-none cursor-pointer"
      >
        {PENALTY_STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#141414]">
            {opt.label}
          </option>
        ))}
      </select>

      {/* Spacer */}
      <div className="flex-1" />

      {/* From date */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-[#6B7280]">From</span>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          className={dateClass}
        />
      </div>

      {/* To date */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-[#6B7280]">To</span>
        <input
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          className={dateClass}
        />
      </div>

      {/* Export CSV */}
      <Button
        onClick={handleExport}
        className="bg-[#FACC15] text-black hover:bg-[#E5B800] h-9"
      >
        <Download className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
}
