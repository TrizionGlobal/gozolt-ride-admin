'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ENTITY_TYPES,
  ACTION_TYPES,
  ACTION_DISPLAY,
  ADMIN_LIST,
} from '@/services/admin/audit-log.types';
import { toast } from 'sonner';

interface AuditLogFiltersProps {
  entityType: string;
  onEntityTypeChange: (value: string) => void;
  action: string;
  onActionChange: (value: string) => void;
  actorId: string;
  onActorIdChange: (value: string) => void;
  fromDate: string;
  onFromDateChange: (value: string) => void;
  toDate: string;
  onToDateChange: (value: string) => void;
}

const selectClass =
  'h-9 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20 appearance-none';

const dateClass =
  'h-9 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20';

export function AuditLogFilters({
  entityType,
  onEntityTypeChange,
  action,
  onActionChange,
  actorId,
  onActorIdChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
}: AuditLogFiltersProps) {
  const handleExport = () => {
    toast.success('Export started — CSV will be downloaded shortly');
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Admin filter */}
      <select
        value={actorId}
        onChange={(e) => onActorIdChange(e.target.value)}
        className={selectClass}
      >
        <option value="" className="bg-[#141414]">All Admin</option>
        {ADMIN_LIST.map((a) => (
          <option key={a.id} value={a.id} className="bg-[#141414]">
            {a.email}
          </option>
        ))}
      </select>

      {/* Action filter */}
      <select
        value={action}
        onChange={(e) => onActionChange(e.target.value)}
        className={selectClass}
      >
        <option value="" className="bg-[#141414]">All Actions</option>
        {ACTION_TYPES.map((a) => (
          <option key={a} value={a} className="bg-[#141414]">
            {ACTION_DISPLAY[a] ?? a}
          </option>
        ))}
      </select>

      {/* Entity type filter */}
      <select
        value={entityType}
        onChange={(e) => onEntityTypeChange(e.target.value)}
        className={selectClass}
      >
        <option value="" className="bg-[#141414]">All Entities</option>
        {ENTITY_TYPES.map((e) => (
          <option key={e} value={e} className="bg-[#141414]">
            {e}
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
